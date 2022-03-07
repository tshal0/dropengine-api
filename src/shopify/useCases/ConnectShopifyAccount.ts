import {
  Injectable,
  Scope,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from '@shared/domain/UseCase';
import moment from "moment";
import { Result } from '@shared/domain/Result';
import { ConnectShopifyAccountDto as ConnectShopifyAccountDto } from '../dto/ConnectShopifyAccountDto';
import { ShopifyAccount } from '../domain/entities/ShopifyAccount';
import {
  ShopifyAccountCreated,
  ShopifyAccountEventType,
} from '../domain/events/ShopifyAccountEvent';
import { ConfigService } from '@nestjs/config';
import { Constants } from '@shared/Constants';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';
import {
  DbShopifyAccountsRepository,
  ShopifyAccountDuplicateShopOrigin,
} from '../database/DbShopifyAccountsRepository';

@Injectable({ scope: Scope.DEFAULT })
export class ConnectShopifyAccountUseCase
  implements UseCase<ConnectShopifyAccountDto, any>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private config: ConfigService,
    private _repo: DbShopifyAccountsRepository,
  ) {}
  get llog() {
    return `[${moment()}][${ConnectShopifyAccountUseCase.name}]`;
  }

  async execute(dto: ConnectShopifyAccountDto): Promise<Result<ShopifyAccount>> {
    this.logger.log(`${this.llog} Executing use case...`);
    let baseUrl = this.config.get(Constants.SHOPIFY_API_URL);
    let key = this.config.get(Constants.SHOPIFY_API_KEY);
    let secret = this.config.get(Constants.SHOPIFY_API_SECRET);
    this.logger.debug(`${this.llog} ${baseUrl} ${key} ${secret}`);
    try {
      let exists = await this._repo.existsByShopOrigin(`${dto.shop}`);
      if (exists) {
        throw new ShopifyAccountDuplicateShopOrigin(dto.shop);
      }
      let event = ShopifyAccountCreated.generate(dto);
      let account = ShopifyAccount.create()
        .beginConnectionProcess(event)
        .generateInstallLink(key, baseUrl);

      account = await this._repo.create(account);
      this.eventEmitter.emit(ShopifyAccountEventType.Created, event);
      return Result.ok(account);
    } catch (error: any) {
      this.logger.error(`${this.llog} ${error?.message}`);
      throw error;
    }
  }
}
