import {
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from '@shared/domain/UseCase';
import * as moment from 'moment';
import { Result } from '@shared/domain/Result';
import { UUID } from '@shared/domain/ValueObjects';
import { ConnectShopifyAccountDto } from '../dto/ConnectShopifyAccountDto';
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
  ShopifyAccountNotFoundException,
} from '../database/DbShopifyAccountsRepository';

@Injectable({ scope: Scope.DEFAULT })
export class DeleteShopifyAccountUseCase implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private config: ConfigService,
    private _repo: DbShopifyAccountsRepository,
  ) {}
  get llog() {
    return `[${moment()}][${DeleteShopifyAccountUseCase.name}]`;
  }

  async execute(id: UUID): Promise<Result<ShopifyAccount>> {
    this.logger.log(`${this.llog} Executing use case...`);
    let baseUrl = this.config.get(Constants.SHOPIFY_API_URL);
    let key = this.config.get(Constants.SHOPIFY_API_KEY);
    let secret = this.config.get(Constants.SHOPIFY_API_SECRET);
    this.logger.debug(`${this.llog} ${baseUrl} ${key} ${secret}`);
    try {
      let exists = await this._repo.exists(id);
      if (exists) {
        let account = await this._repo.delete(id);
        return Result.ok();
      } else {
        throw new ShopifyAccountNotFoundException(id.value);
      }
    } catch (error: any) {
      this.logger.error(`${this.llog} ${error?.message}`);
      throw error;
    }
  }
}
