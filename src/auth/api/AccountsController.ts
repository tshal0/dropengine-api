import { AccountId } from "@auth/domain/valueObjects/AccountId";
import { CreateAccountApiDto } from "@auth/dto/CreateAccountDto";
import { IAddMemberDto } from "@auth/dto/UpdateAccountMembersDto";
import { AddMembersUseCase } from "@auth/useCases/Account/AddMember";
import { CreateAccountUseCase } from "@auth/useCases/Account/CreateAccount";
import { DeleteAccountUseCase } from "@auth/useCases/Account/DeleteAccount";
import { GetAccountUseCase } from "@auth/useCases/Account/GetAccount";
import { GetAccountsUseCase } from "@auth/useCases/Account/GetAllAccounts";
import { RemoveMembersUseCase } from "@auth/useCases/Account/RemoveMember";
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import {
  AccountMemberDto,
  AccountResponseDto,
  IAccountResponseDto,
} from "@auth/dto/AccountResponseDto";
import { EntityNotFoundException } from "@shared/exceptions";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { User } from "@auth/domain";
import { Account } from "@auth/domain/aggregates/Account";
import { AddStoreUseCase } from "@auth/useCases/Store/AddStore";
import { RemoveStoreUseCase } from "@auth/useCases/Account/RemoveStore";
import { CreateStoreDto } from "@auth/dto/CreateStoreDto";

@Controller("auth/accounts")
export class AccountsController {
  private readonly logger: Logger = new Logger(AccountsController.name);

  constructor(
    private readonly auth0: Auth0MgmtApiClient,
    private readonly getAccount: GetAccountUseCase,
    private readonly getAccounts: GetAccountsUseCase,
    private readonly deleteAccount: DeleteAccountUseCase,
    private readonly createAccount: CreateAccountUseCase,
    private readonly addMember: AddMembersUseCase,
    private readonly removeMember: RemoveMembersUseCase,
    private readonly removeStore: RemoveStoreUseCase,
    private readonly addStore: AddStoreUseCase
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string): Promise<IAccountResponseDto> {
    let result = await this.getAccount.execute(id);
    if (result.isFailure) {
      throw new EntityNotFoundException(
        `Failed to Find Account '${id}'`,
        id,
        result.error.message
      );
    }
    return await this.generateAccountResponse(result.value());
  }

  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    let result = await this.deleteAccount.execute(AccountId.from(id).value());
    if (result.isSuccess) {
      return result.value();
    }
  }
  @Get(":id/members")
  @UseGuards(AuthGuard())
  async getAccountMembers(
    @Param("id") id: string,
    @Body() dto: IAddMemberDto
  ): Promise<IAccountResponseDto> {
    let result = await this.addMember.execute({
      id: AccountId.from(id).value(),
      userId: dto.userId,
    });
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to Add User '${dto.userId}' to Account '${id}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Delete(":id/members/:userId")
  @UseGuards(AuthGuard())
  async removeMemberById(
    @Param("id") id: string,
    @Param("userId") userId: string
  ): Promise<IAccountResponseDto> {
    const dto = {
      id: AccountId.from(id).value(),
      userId,
    };
    let result = await this.removeMember.execute(dto);
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to Remove User '${userId}' from Account '${id}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Post(":id/members")
  @UseGuards(AuthGuard())
  async addMemberById(
    @Param("id") id: string,
    @Body() dto: IAddMemberDto
  ): Promise<IAccountResponseDto> {
    let result = await this.addMember.execute({
      id: AccountId.from(id).value(),
      userId: dto.userId,
    });
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to Add User '${dto.userId}' to Account '${id}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Post(":id/stores")
  async postStore(
    @Param("id") id: string,
    @Body() dto: CreateStoreDto
  ): Promise<IAccountResponseDto> {
    if (!dto.accountId) {
      dto.accountId = id;
    }
    let result = await this.addStore.execute(dto);
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to create Store '${dto.storeName}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Delete(":id/stores/:storeId")
  @UseGuards(AuthGuard())
  async deleteStore(
    @Param("id") id: string,
    @Param("storeId") storeId: string
  ): Promise<IAccountResponseDto> {
    const dto = {
      accountId: id,
      storeId,
    };
    let result = await this.removeStore.execute(dto);
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to Remove Store '${storeId}' from Account '${id}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Post()
  async post(@Body() dto: CreateAccountApiDto): Promise<IAccountResponseDto> {
    let result = await this.createAccount.execute(dto);
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to create Account '${dto.companyCode}'`
      );
    }
    return await this.generateAccountResponse(result.value());
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAllAccounts(): Promise<IAccountResponseDto[]> {
    let result = await this.getAccounts.execute();
    if (result.isFailure) {
      throw new UnprocessableEntityException(
        result.error,
        `Failed to Fetch All Accounts`
      );
    }
    let resp = result.value().map((a) => AccountResponseDto.from(a).json());
    return resp;
  }
  private async generateAccountResponse(acct: Account) {
    const accountId = acct.props().id;
    let json = AccountResponseDto.from(acct).json();
    json.members = await this.loadAccountMembers(accountId);
    return json;
  }
  private async loadAccountMembers(accountId: string) {
    let auth0Resp = await this.auth0.getAccountUsers(accountId, 0);
    let users = auth0Resp.map((u) => User.fromAuth0User(u));
    const members = users.map((u) => new AccountMemberDto(u));
    return members;
  }
}
