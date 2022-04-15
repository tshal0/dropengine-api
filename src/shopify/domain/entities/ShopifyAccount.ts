import { IDomainEventProps } from "@shared/domain/events/BaseDomainEvents";
import { InvalidUuidException, UUID } from "@shared/domain/valueObjects";
import moment from "moment";
import { ConnectShopifyAccountDto } from "../../dto/ConnectShopifyAccountDto";
import {
  IShopifyAccountInstall,
  ShopifyAccountInstall,
} from "./ShopifyAccountInstall";
import { ShopifyAccountStatus } from "./ShopifyAccountStatus";
import {
  ShopifyAccountAccessTokenGenerated,
  ShopifyAccountCreated,
  ShopifyAccountEvent,
  ShopifyAccountInstallInitiated,
} from "../events/ShopifyAccountEvent";
import { UnprocessableEntityException } from "@nestjs/common";
import { InstallShopifyAccountDto } from "../../dto/InstallShopifyAccountDto";
import { AcceptShopifyInstallDto } from "../../dto/AcceptShopifyInstallDto";
import { isNull } from "lodash";

export interface IShopifyAccount {
  id: string;
  userId: string;
  shopOrigin: string;
  accessToken: string;
  scopes: string;

  status: any;

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

  status: any;
  installation?: ShopifyAccountInstall | undefined;

  createdAt: Date;
  updatedAt: Date;
  events: ShopifyAccountEvent[];
}
export class ShopifyAccount {
  protected _props: ShopifyAccountProps;
  private constructor(props: ShopifyAccountProps) {
    this._props = props;
  }

  public get id() {
    return this._props.id;
  }

  public get accessTokenLink() {
    return this._props.installation?.accessTokenLink;
  }
  public get authorizationCode() {
    return this._props.installation?.props().authorizationCode;
  }

  props(): IShopifyAccount {
    const props: IShopifyAccount = {
      id: this._props.id.value(),
      userId: this._props.userId.value(),
      shopOrigin: this._props.shopOrigin,
      accessToken: this._props.accessToken,
      scopes: this._props.scopes,
      status: this._props.status,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      events: this._props.events?.map((e) => e.props()) || [],
      installation: this._props.installation?.props(),
    };
    return props;
  }
  toDb(): any {
    const props: any = {
      id: this._props.id.value(),
      userId: this._props.userId.value(),
      shopOrigin: this._props.shopOrigin,
      accessToken: this._props.accessToken,
      scopes: this._props.scopes,
      status: this._props.status,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
      events: this._props.events?.map((e) => e.toDbEvent()) || [],
      installation: this._props.installation?.toDb(),
    };
    return props;
  }
  public static init(dbShopifyAccount: any): ShopifyAccount {
    try {
      const id = UUID.from(dbShopifyAccount.id);
      const userId = UUID.from(dbShopifyAccount.userId);
      const installation = ShopifyAccountInstall.fromDb(
        dbShopifyAccount.installation
      );
      const events =
        dbShopifyAccount.events?.map((e) =>
          new ShopifyAccountEvent().fromDbEvent(e)
        ) || [];
      const props: ShopifyAccountProps = {
        id: id.value(),
        userId: userId.value(),
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
      throw new UnprocessableEntityException(
        `Unable To Load ShopifyAccount From Db`
      );
    }
  }
  public static create(): ShopifyAccount {
    const na = "NOT_AVAILABLE";
    const now = moment().toDate();
    const id = UUID.generate();
    const props: ShopifyAccountProps = {
      id: id,
      userId: id,
      shopOrigin: na,
      accessToken: na,
      scopes: na,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
      events: [],
      installation: null,
    };
    let account = new ShopifyAccount(props);
    return account;
  }
  public beginConnectionProcess(
    created: ShopifyAccountCreated
  ): ShopifyAccount {
    const dto = created.details;

    const shopifyAccountId = created.aggregateId;
    this._props.id = shopifyAccountId;

    const userId = UUID.from(dto.userId);
    if (isNull(dto.userId?.length)) {
      throw new InvalidUuidException(
        `UserID is null or empty.`,
        dto?.userId,
        `INVALID_USER_ID`
      );
    }
    const defaultScopes =
      "read_orders,read_price_rules,read_products,read_order_edits";

    const installDto: InstallShopifyAccountDto = {
      ...dto,
      shopifyAccountId: shopifyAccountId.value(),
      scopes: defaultScopes,
    };

    this.forUser(userId.value())
      .forShopOrigin(dto.shop)
      .setScopes(defaultScopes)
      .raiseEvent(created)
      .initInstall(installDto);
    return this;
  }

  public raiseEvent(event: ShopifyAccountEvent) {
    this._props.events.push(event);
    return this;
  }
  public forUser(id: UUID) {
    this._props.userId = id;
    return this;
  }

  public forShopOrigin(shop: string) {
    this._props.shopOrigin = `${shop}`;
    return this;
  }

  public setScopes(scopes: string) {
    this._props.scopes = scopes;
    return this;
  }
  public generateAccessToken(event: ShopifyAccountAccessTokenGenerated) {
    // validate scope, token, raise event
    this._props.accessToken = event.details.access_token;
    this._props.installation.withAccessToken(event.details.access_token);
    this.raiseEvent(event);
    return this;
  }

  public initInstall(dto: InstallShopifyAccountDto) {
    let installation = ShopifyAccountInstall.create();
    installation.init(dto);
    const installInitiated = ShopifyAccountInstallInitiated.generate(dto);
    //TODO: handle pre-existing installation?
    this._props.installation = installation;
    this._props.status = "PENDING_INSTALL";
    this.raiseEvent(installInitiated);
    return this;
  }
  public generateInstallLink(key: string, baseUrl: string) {
    let install = this._props.installation;
    if (install) {
      install.generateInstallLink(key, baseUrl);
    }
    return this;
  }
  acceptShopifyInstall(dto: AcceptShopifyInstallDto) {
    let install = this._props.installation;
    if (install) {
      install.accept(dto);
      install.generateAccessTokenRequestLink();
    }
    return this;
  }
  getInstallLink() {
    return this._props.installation?.installLink;
  }
  public pending() {
    this._props.status = "PENDING";
    return this;
  }
  public activate() {
    this._props.status = "ACTIVE";
    return this;
  }
  public deactivate() {
    this._props.status = "INACTIVE";
    return this;
  }
  public disable() {
    this._props.status = "DISABLED";
    return this;
  }
}
