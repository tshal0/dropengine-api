import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from '@shared/domain/UseCase';
import * as moment from 'moment';
import { Result } from '@shared/domain/Result';
import { ShopifyAccount } from '../domain/entities/ShopifyAccount';
import {
  ShopifyAccountAccessTokenGenerated,
  ShopifyAccountEventType,
} from '../domain/events/ShopifyAccountEvent';
import { ConfigService } from '@nestjs/config';
import { Constants } from '@shared/Constants';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';
import { AcceptShopifyInstallDto } from '../dto/AcceptShopifyInstallDto';
import { ShopifyApiClient } from '../ShopifyApiClient';
import { DbShopifyAccountsRepository } from '../database/DbShopifyAccountsRepository';

@Injectable({ scope: Scope.DEFAULT })
export class AcceptShopifyInstallUseCase
  implements UseCase<AcceptShopifyInstallDto, any>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private config: ConfigService,
    private _repo: DbShopifyAccountsRepository,
    private _api: ShopifyApiClient,
  ) {}
  get llog() {
    return `[${moment()}][${AcceptShopifyInstallUseCase.name}]`;
  }

  async execute(dto: AcceptShopifyInstallDto): Promise<Result<ShopifyAccount>> {
    this.logger.log(`${this.llog} Executing use case...`);
    let baseUrl = this.config.get(Constants.SHOPIFY_API_URL);
    let key = this.config.get(Constants.SHOPIFY_API_KEY);
    let secret = this.config.get(Constants.SHOPIFY_API_SECRET);
    this.logger.debug(`${this.llog} ${baseUrl} ${key} ${secret}`);
    try {
      let account = await this._repo.findByShopOrigin(dto.shop);

      account.acceptShopifyInstall(dto);

      account = await this._repo.save(account);
      let link = account.accessTokenLink;
      let code = account.authorizationCode;
      let payload = {
        client_id: key,
        client_secret: secret,
        code: code,
      };
      let resp = await this._api.createAccessToken(link, payload);
      let accessTokenGenerated =
        ShopifyAccountAccessTokenGenerated.generate(resp);
      account.generateAccessToken(accessTokenGenerated);
      account = await this._repo.save(account);
      

      return Result.ok(account);
    } catch (error: any) {
      this.logger.error(`${this.llog} ${error?.message}`);
      throw error;
    }
  }
}
