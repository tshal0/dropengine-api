import { UnprocessableEntityException } from '@nestjs/common';
import { AggregateType } from '@shared/domain/events/AggregateType';
import { BaseDomainEvent } from '@shared/domain/events/BaseDomainEvents';
import { UUID } from '@shared/domain/ValueObjects';
import { isNull } from 'lodash';
import * as moment from 'moment';
import { AcceptShopifyInstallDto } from '../../dto/AcceptShopifyInstallDto';
import { AccessTokenGeneratedDto } from '../../dto/AccessTokenGeneratedDto';
import { ConnectShopifyAccountDto } from '../../dto/ConnectShopifyAccountDto';
import { InstallShopifyAccountDto } from '../../dto/InstallShopifyAccountDto';
import { ShopifyAccount } from '../entities/ShopifyAccount';

export const ShopifyAccountEventType = {
  Unknown: `${AggregateType.ShopifyAccount}.Unknown`,
  Created: `${AggregateType.ShopifyAccount}.Created`,
  InstallInitiated: `${AggregateType.ShopifyAccount}.InstallInitiated`,
  ShopOriginValidated: `${AggregateType.ShopifyAccount}.ShopOriginValidated`,
  HmacValidated: `${AggregateType.ShopifyAccount}.HmacValidated`,
  InstallLinkGenerated: `${AggregateType.ShopifyAccount}.InstallLinkGenerated`,
  InstallAccepted: `${AggregateType.ShopifyAccount}.InstallAccepted`,
  AccessTokenLinkGenerated: `${AggregateType.ShopifyAccount}.AccessTokenLinkGenerated`,
  AccessTokenRequested: `${AggregateType.ShopifyAccount}.AccessTokenRequested`,
  AccessTokenReceived: `${AggregateType.ShopifyAccount}.AccessTokenReceived`,
  InstallationCompleted: `${AggregateType.ShopifyAccount}.InstallCompleted`,
  UninstallWebhookAdded: `${AggregateType.ShopifyAccount}.UninstallWebhookAdded`,
  InstallationFailed: `${AggregateType.ShopifyAccount}.Failed`,
};
export class ShopifyAccountEvent extends BaseDomainEvent {
  public readonly aggregateType = AggregateType.ShopifyAccount;
  public eventType = ShopifyAccountEventType.Unknown;
  public details: any;
  fromDbEvent(dbEvent: any) {
    this.eventId = UUID.from(dbEvent.eventId);
    this.eventType = dbEvent.eventType;
    this.aggregateId = UUID.from(dbEvent.aggregateId);
    this.timestamp = moment(dbEvent.timestamp).toDate();
    this.details = JSON.parse(dbEvent.details);
    return this;
  }
  toDbEvent(): any {
    return {
      eventId: this.getEventId(),
      eventType: this.getEventType(),
      aggregateId: undefined,
      aggregateType: ShopifyAccount.name,
      timestamp: this.timestamp,
      details: JSON.stringify({ ...this.details }),
    };
  }
  public static generateUuid() {
    return UUID.generate();
  }
}

export class ShopifyAccountCreated extends ShopifyAccountEvent {
  public readonly eventType = ShopifyAccountEventType.Created;
  public details: ConnectShopifyAccountDto = {
    userId: 'NOT_AVAILABLE',
    shop: 'NOT_AVAILABLE',
    timestamp: 0,
    hmac: 'NOT_AVAILABLE',
  };
  public static generate(dto: ConnectShopifyAccountDto) {
    const id = UUID.generate();
    const event = new ShopifyAccountCreated();
    event.new().forAggregate(id);
    event.details = dto;
    event.forOrigin(dto.shop);
    event.withTimestamp(dto.timestamp);

    return event;
  }
  public forOrigin(shopOrigin: string) {
    let re = new RegExp(/[a-zA-Z0-9][a-zA-Z0-9\-]*/);
    let res = re.test(shopOrigin);
    if (!res) {
      throw new UnprocessableEntityException(`InvalidShopOrigin`);
    }
    this.details.shop = shopOrigin;
  }
  public withTimestamp(ts: number) {
    if (isNull(ts)) {
      throw new UnprocessableEntityException(`InvalidTimestamp`);
    } else {
      let dts = new Date(ts);
      this.details.timestamp = ts;
      this.timestamp = dts;
    }
  }
}

export class ShopifyAccountAccessTokenGenerated extends ShopifyAccountEvent {
  public readonly eventType = ShopifyAccountEventType.AccessTokenReceived;
  public details: AccessTokenGeneratedDto = {
    access_token: 'NOT_AVAILABLE',
    scope: 'NOT_AVAILABLE',
  };
  public static generate(dto: AccessTokenGeneratedDto) {
    const id = UUID.generate();
    const event = new ShopifyAccountAccessTokenGenerated();
    event.new().forAggregate(id);
    event.details = dto;
    event.withAccessToken(dto.access_token);

    return event;
  }
  public withAccessToken(token: string) {
    this.details.access_token = token;
  }
}
export class ShopifyAccountInstallInitiated extends ShopifyAccountEvent {
  public readonly eventType = ShopifyAccountEventType.InstallInitiated;
  public details: InstallShopifyAccountDto = {
    shop: 'NOT_AVAILABLE',
    timestamp: 0,
    hmac: 'NOT_AVAILABLE',
    shopifyAccountId: 'NOT_AVAILABLE',
    scopes: 'NOT_AVAILABLE',
  };
  public static generate(dto: InstallShopifyAccountDto) {
    const id = UUID.generate();
    const event = new ShopifyAccountInstallInitiated();
    event.new().forAggregate(id);
    event.details = dto;
    return event;
  }
}

export class ShopifyAccountInstallAccepted extends ShopifyAccountEvent {
  public readonly eventType = ShopifyAccountEventType.InstallAccepted;
  public details: AcceptShopifyInstallDto = {
    shop: 'NOT_AVAILABLE',
    timestamp: new Date(0),
    hmac: 'NOT_AVAILABLE',
    code: 'NOT_AVAILABLE',
    host: 'NOT_AVAILABLE',
    state: 0,
    url: 'NOT_AVAILABLE',
    installId: 'NOT_AVAILABLE',
  };
  public static generate(dto: AcceptShopifyInstallDto) {
    const event = new ShopifyAccountInstallAccepted();
    const aggregateId = UUID.from(dto.installId);
    event.new().forAggregate(aggregateId);
    event.details = dto;
    return event;
  }
}
