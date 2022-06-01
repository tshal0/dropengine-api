import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { HandleOrderPlaced } from "@myeasysuite/features/HandleOrderPlaced";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { Result } from "@shared/domain";
import { AccountsRepository } from "./database/AccountsRepository";
import { User } from "./domain";
import { Account } from "./domain/aggregates/Account";
import { CompanyCode } from "./domain/valueObjects/CompanyCode";
import { CreateAccountDto } from "./dto";

@Injectable({ scope: Scope.DEFAULT })
export class IdentityService {
  private readonly logger: Logger = new Logger(HandleOrderPlaced.name);
  constructor(
    private _repo: AccountsRepository,
    private auth0: Auth0MgmtApiClient
  ) {}

  async findOrCreateAccountByCode(code: string): Promise<Result<Account>> {
    let result = await this._repo.loadByCompanyCode(
      CompanyCode.from(code).value()
    );
    if (result.isFailure) {
      let dto = new CreateAccountDto();
      dto.companyCode = code;
      dto.name = code;

      let admin = await this.auth0.getAdminByEmail();
      dto.owner = User.fromAuth0User(admin).props();

      result = Account.create(dto);
      if (result.isFailure) {
        this.logger.error(result.error);
        return result;
      }
      let account = result.value();
      result = await this._repo.save(account);
      if (result.isFailure) {
        this.logger.error(result.error);
        return result;
      }
    }
    return result;
  }
}
