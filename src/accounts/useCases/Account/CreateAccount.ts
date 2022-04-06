import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import {
  CreateAccountApiDto,
  CreateAccountDto,
} from "../../dto/CreateAccountDto";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Account } from "../../domain/aggregates/Account";
import { User } from "@accounts/domain";
import { AccountsRepository } from "@accounts/database/AccountsRepository";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class CreateAccountUseCase implements UseCase<CreateAccountApiDto, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private auth0: Auth0MgmtApiClient,
    private _repo: AccountsRepository
  ) {}
  get llog() {
    return `[${moment()}][${CreateAccountUseCase.name}]`;
  }

  async execute(dto: CreateAccountApiDto): Promise<Result<Account>> {
    try {
      let resp = await this.auth0.getUser(dto.ownerId);
      let owner = User.fromAuth0User(resp);

      let createDto: CreateAccountDto = {
        id: dto.id,
        name: dto.name,
        companyCode: dto.companyCode,
        owner: owner.props(),
        defaultStoreName: dto.defaultStoreName,
      };
      let result = Account.create(createDto);
      if (result.isFailure) {
        return Result.fail(result.error, dto.companyCode);
      }
      let account = result.value();
      result = await this._repo.save(account);
      if (result.isFailure) {
        return Result.fail(result.error, dto.companyCode);
      }
      account = result.value();
      // Update Owner AppMetadata
      owner.addOwnedAccount(account);
      let auth0Owner = owner.toAuth0();
      resp = await this.auth0.patchUserAppMetadata(
        auth0Owner.user_id,
        auth0Owner.app_metadata
      );
      this.logger.debug({ resp });
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
