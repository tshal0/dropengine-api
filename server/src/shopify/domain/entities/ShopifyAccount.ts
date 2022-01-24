import { IDomainEventProps } from '@shared/domain/events/BaseDomainEvents';
import { InvalidUuidException, UUID } from '@shared/domain/ValueObjects';
import * as moment from 'moment';
import { ConnectShopifyAccountDto } from '../../dto/ConnectShopifyAccountDto';
import {
  IShopifyAccountInstall,
  ShopifyAccountInstall,
} from './ShopifyAccountInstall';
import { ShopifyAccountStatus } from './ShopifyAccountStatus';
import {
  ShopifyAccountAccessTokenGenerated,
  ShopifyAccountCreated,
  ShopifyAccountEvent,
  ShopifyAccountInstallInitiated,
} from '../events/ShopifyAccountEvent';
import {
  DbShopifyAccount,
  DbShopifyAccountStatus,
} from '@shared/modules/prisma/models/ShopifyAccount';
import { UnprocessableEntityException } from '@nestjs/common';
import { InstallShopifyAccountDto } from '../../dto/InstallShopifyAccountDto';
import { AcceptShopifyInstallDto } from '../../dto/AcceptShopifyInstallDto';
import { isNull } from 'lodash';

export interface IShopifyAccount {
  id: string;
  userId: string;
  shopOrigin: string;
  accessToken: string;
  scopes: string;

  status: DbShopifyAccountStatus;

  installation?: IShopifyAccountInstall | undefined;

  createdAt: Date;
  updatedAt: Date;
  events: IDomainEventProps[];
}

export interface ShopifyAccountProps {
  id: UUID;
  userId: UUID;
  shopOrigin: string;
  accessToken: string;
  scopes: string;

  status: DbShopifyAccountStatus;
  installation?: ShopifyAccountInstall | undefined;

  createdAt: Date;
  updatedAt: Date;
  events: ShopifyAccountEvent[];
}
export class ShopifyAccount {
  protected props: ShopifyAccountProps;
  private constructor(props: ShopifyAccountProps) {
    this.props = props;
  }

  public get id() {
    return this.props.id;
  }

  public get accessTokenLink() {
    return this.props.installation?.accessTokenLink;
  }
  public get authorizationCode() {
    return this.props.installation?.getProps().authorizationCode;
  }

  getProps(): IShopifyAccount {
    const props: IShopifyAccount = {
      id: this.props.id.value,
      userId: this.props.userId.value,
      shopOrigin: this.props.shopOrigin,
      accessToken: this.props.accessToken,
      scopes: this.props.scopes,
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      events: this.props.events?.map((e) => e.getProps()) || [],
      installation: this.props.installation?.getProps(),
    };
    return props;
  }
  toDb(): DbShopifyAccount {
    const props: DbShopifyAccount = {
      id: this.props.id.value,
      userId: this.props.userId.value,
      shopOrigin: this.props.shopOrigin,
      accessToken: this.props.accessToken,
      scopes: this.props.scopes,
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      events: this.props.events?.map((e) => e.toDbEvent()) || [],
      installation: this.props.installation?.toDb(),
    };
    return props;
  }
  public static init(dbShopifyAccount: DbShopifyAccount): ShopifyAccount {
    try {
      const id = UUID.from(dbShopifyAccount.id);
      const userId = UUID.from(dbShopifyAccount.userId);
      const installation = ShopifyAccountInstall.fromDb(
        dbShopifyAccount.installation,
      );
      const events =
        dbShopifyAccount.events?.map((e) =>
          new ShopifyAccountEvent().fromDbEvent(e),
        ) || [];
      const props: ShopifyAccountProps = {
        id: id,
        userId: userId,
        shopOrigin: dbShopifyAccount.shopOrigin,
        accessToken: dbShopifyAccount.accessToken,
        scopes: dbShopifyAccount.scopes,
        status: dbShopifyAccount.status,
        installation: installation,
        createdAt: dbShopifyAccount.createdAt,
        updatedAt: dbShopifyAccount.updatedAt,
        events: events,
      };
      const account = new ShopifyAccount(props);
      return account;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(
        `Unable To Load ShopifyAccount From Db`,
      );
    }
  }
  public static create(): ShopifyAccount {
    const na = 'NOT_AVAILABLE';
    const now = moment().toDate();
    const id = UUID.generate();
    const props: ShopifyAccountProps = {
      id: id,
      userId: id,
      shopOrigin: na,
      accessToken: na,
      scopes: na,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      events: [],
      installation: null,
    };
    let account = new ShopifyAccount(props);
    return account;
  }
  public beginConnectionProcess(
    created: ShopifyAccountCreated,
  ): ShopifyAccount {
    const dto = created.details;

    const shopifyAccountId = created.aggregateId;
    this.props.id = shopifyAccountId;

    const userId = UUID.from(dto.userId);
    if (isNull(dto.userId?.length)) {
      throw new InvalidUuidException(
        `UserID is null or empty.`,
        dto?.userId,
        `INVALID_USER_ID`,
      );
    }
    const defaultScopes =
      'read_orders,read_price_rules,read_products,read_order_edits';

    const installDto: InstallShopifyAccountDto = {
      ...dto,
      shopifyAccountId: shopifyAccountId.value,
      scopes: defaultScopes,
    };

    this.forUser(userId)
      .forShopOrigin(dto.shop)
      .setScopes(defaultScopes)
      .raiseEvent(created)
      .initInstall(installDto);
    return this;
  }

  public raiseEvent(event: ShopifyAccountEvent) {
    this.props.events.push(event);
    return this;
  }
  public forUser(id: UUID) {
    this.props.userId = id;
    return this;
  }

  public forShopOrigin(shop: string) {
    this.props.shopOrigin = `${shop}`;
    return this;
  }

  public setScopes(scopes: string) {
    this.props.scopes = scopes;
    return this;
  }
  public generateAccessToken(event: ShopifyAccountAccessTokenGenerated) {
    // validate scope, token, raise event
    this.props.accessToken = event.details.access_token;
    this.props.installation.withAccessToken(event.details.access_token);
    this.raiseEvent(event);
    return this;
  }

  public initInstall(dto: InstallShopifyAccountDto) {
    let installation = ShopifyAccountInstall.create();
    installation.init(dto);
    const installInitiated = ShopifyAccountInstallInitiated.generate(dto);
    //TODO: handle pre-existing installation?
    this.props.installation = installation;
    this.props.status = 'PENDING_INSTALL';
    this.raiseEvent(installInitiated);
    return this;
  }
  public generateInstallLink(key: string, baseUrl: string) {
    let install = this.props.installation;
    if (install) {
      install.generateInstallLink(key, baseUrl);
    }
    return this;
  }
  acceptShopifyInstall(dto: AcceptShopifyInstallDto) {
    let install = this.props.installation;
    if (install) {
      install.accept(dto);
      install.generateAccessTokenRequestLink();
    }
    return this;
  }
  getInstallLink() {
    return this.props.installation?.installLink;
  }
  public pending() {
    this.props.status = 'PENDING';
    return this;
  }
  public activate() {
    this.props.status = 'ACTIVE';
    return this;
  }
  public deactivate() {
    this.props.status = 'INACTIVE';
    return this;
  }
  public disable() {
    this.props.status = 'DISABLED';
    return this;
  }
}
