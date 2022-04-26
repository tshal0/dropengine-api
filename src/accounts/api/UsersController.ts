import {
  GetUserUseCase,
  GetAllUsersUseCase,
  DeleteUserUseCase,
} from "@accounts/useCases";
import { RemoveAllUserAccountsUseCase } from "@accounts/useCases/User/RemoveAllUserAccounts";
import { IAuth0User } from "@auth0/domain/Auth0ExtendedUser";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { CreateUserDto } from "../dto/CreateUserDto";
import { CreateUserUseCase } from "../useCases/User/CreateUser";

@Controller("/users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly logger: AzureTelemetryService,
    private readonly getUser: GetUserUseCase,
    private readonly getAll: GetAllUsersUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly removeAccounts: RemoveAllUserAccountsUseCase
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let result = await this.getUser.execute(id);
    if (result.isSuccess) {
      return result.value().props();
    }
  }
  @Delete(":id/accounts")
  @UseGuards(AuthGuard())
  async deleteAccounts(@Param("id") id: string) {
    let result = await this.removeAccounts.execute(id);
    if (result.isSuccess) {
      return result.value();
    }
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    let result = await this.deleteUser.execute(id);
    if (result.isSuccess) {
      return result.value();
    }
  }
  @Post()
  async post(@Body() dto: CreateUserDto): Promise<IAuth0User> {
    let result = await this.createUser.execute(dto);
    if (result.isSuccess) {
      let value = result.value();
      let props = value?.props();
      return props;
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAllUsers(): Promise<IAuth0User[]> {
    let result = await this.getAll.execute();
    if (result.isSuccess) {
      return result.value().map((v) => v.props());
    }
  }
}
