import { UUID } from "@shared/domain/valueObjects";
import moment from "moment";
import { AcceptShopifyInstallDto } from "../../dto/AcceptShopifyInstallDto";
import { InstallShopifyAccountDto } from "../../dto/InstallShopifyAccountDto";
import { ShopifyAccountInstallStatus } from "./ShopifyAccountInstallStatus";
import * as crypto from "crypto";
import { UnprocessableEntityException } from "@nestjs/common";
import { isInteger, parseInt } from "lodash";
import { ShopifyAccountInstallInitiated } from "../events/ShopifyAccountEvent";
export interface IShopifyAccountInstall {
  id: string;
  shopifyAccountId: string;

  shop: string;
  timestamp: number;
  hmac: string;
  nonce: number;
  scopes: string;
  authorizationCode: string;
  installLink: string;
  accessTokenLink: string;
  accessToken: string;

  status: any;

  failedReason: any;

  createdAt: Date;
  updatedAt: Date;
}

export interface ShopifyAccountInstallProps {
  id: UUID;
  shopifyAccountId: UUID;

  shop: string;
  timestamp: number;
  hmac: string;
  nonce: number;
  scopes: string;
  authorizationCode: string;

  installLink: string;
  accessTokenLink: string;
  accessToken: string;

  status: any;
  failedReason: any;

  completedAt?: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class ShopifyAccountInstall {
  protected _props: ShopifyAccountInstallProps;
  private constructor(props: ShopifyAccountInstallProps) {
    this._props= props;
  }

  get status() {
    return this._props.status;
  }

  get installLink() {
    return this._props.installLink;
  }
  get accessTokenLink() {
    return this._props.accessTokenLink;
  }

  get failed() {
    return this.status == ShopifyAccountInstallStatus.FAILED;
  }

  props(): IShopifyAccountInstall {
    const props: IShopifyAccountInstall = {
      id: this._props.id.value(),
      shop: this._props.shop,
      accessToken: this._props.accessToken,
      timestamp: this._props.timestamp,
      hmac: this._props.hmac,
      nonce: this._props.nonce,
      status: this._props.status,
      scopes: this._props.scopes,
      authorizationCode: this._props.authorizationCode,
      shopifyAccountId: this._props.shopifyAccountId.value(),
      installLink: this._props.installLink,
      accessTokenLink: this._props.accessTokenLink,
      failedReason: this._props.failedReason,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
    };
    return props;
  }
  toDb(): any {
    const props: any = {
      id: this._props.id.value(),
      shop: this._props.shop,
      accessToken: this._props.accessToken,
      timestamp: this._props.timestamp,
      hmac: this._props.hmac,
      nonce: this._props.nonce,
      status: this._props.status,
      scopes: this._props.scopes,
      authorizationCode: this._props.authorizationCode,
      shopifyAccountId: undefined,
      installLink: this._props.installLink,
      accessTokenLink: this._props.accessTokenLink,
      failedReason: this._props.failedReason,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
    };
    return props;
  }
  public static fromDb(
    dbInstall: any
  ): ShopifyAccountInstall {
    try {
      const props: ShopifyAccountInstallProps = {
        id: UUID.from(dbInstall.id).value(),
        shopifyAccountId: UUID.from(dbInstall.shopifyAccountId).value(),
        shop: dbInstall.shop,
        timestamp: dbInstall.timestamp,
        hmac: dbInstall.hmac,
        nonce: dbInstall.nonce,
        scopes: dbInstall.scopes,
        authorizationCode: dbInstall.authorizationCode,
        installLink: dbInstall.installLink,
        accessTokenLink: dbInstall.accessTokenLink,
        accessToken: dbInstall.accessToken,
        status: dbInstall.status,
        failedReason: dbInstall.failedReason,
        createdAt: dbInstall.createdAt,
        updatedAt: dbInstall.updatedAt,
      };
      const install = new ShopifyAccountInstall(props);
      return install;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(
        `Unable To Load ShopifyAccount From Db`
      );
    }
  }
  public static create(): ShopifyAccountInstall {
    const na = "NOT_AVAILABLE";
    const now = moment().toDate();
    const defaultDate = moment().toDate().valueOf();
    const id = UUID.generate();
    const props: ShopifyAccountInstallProps = {
      id: id,
      shopifyAccountId: id,
      shop: na,
      hmac: na,
      timestamp: defaultDate,
      status: "PENDING",
      failedReason: "NONE",
      nonce: 0,
      scopes: na,
      authorizationCode: na,
      installLink: na,
      accessTokenLink: na,
      accessToken: na,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    let account = new ShopifyAccountInstall(props);

    return account;
  }
  public init(dto: InstallShopifyAccountDto): ShopifyAccountInstall {
    const shopifyAccountId = UUID.from(dto.shopifyAccountId);

    if (!isInteger(dto.timestamp)) {
      throw new UnprocessableEntityException(`TimestampIsNonInteger`);
    }
    const timestamp = parseInt(dto.timestamp as any);
    this.forShopifyAccount(shopifyAccountId.value())
      .forShop(dto.shop)
      .initiatedAt(timestamp)
      .withScopes(dto.scopes)
      .withHmac(dto.hmac)
      .generateNonce();

    return this;
  }

  public initiatedAt(timestamp: any) {
    this._props.timestamp = parseInt(timestamp);
    return this;
  }
  public forShop(shop: string) {
    this._props.shop = shop;
    return this;
  }

  public withHmac(hmac: string) {
    if (hmac) this._props.hmac = hmac;
    return this;
  }

  public forShopifyAccount(id: UUID) {
    this._props.shopifyAccountId = id;
    return this;
  }

  public withScopes(scopes: string) {
    this._props.scopes = scopes;
    return this;
  }
  public generateNonce() {
    this._props.nonce = moment(this._props.timestamp).valueOf();
    if (!isInteger(this._props.nonce)) {
      throw new UnprocessableEntityException(`NonceIsNotNumber`);
    }
    return this;
  }

  public confirmInstall(
    dto: AcceptShopifyInstallDto,
    SHOPIFY_API_SECRET: string
  ) {
    if (dto.state != this._props.nonce) {
      throw new UnprocessableEntityException(
        `Unable to accept install: Invalid Nonce`
      );
    }
    const message = `code=${dto.code}&shop=${dto.shop}&state=${dto.state}&timestamp=${dto.timestamp}`;
    const providedHmac = Buffer.from(dto.hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto
        .createHmac("sha256", SHOPIFY_API_SECRET)
        .update(message)
        .digest("hex"),
      "utf-8"
    );

    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      throw new UnprocessableEntityException(
        `Unable to accept install: Invalid HMAC`
      );
    }
    return this;
  }

  accept(dto: AcceptShopifyInstallDto) {
    this._props.status = "ACCEPTED";
    this._props.authorizationCode = dto.code;
    this.generateAccessTokenRequestLink();
    return this;
  }

  public withAccessToken(token: string) {
    this._props.accessToken = token;
    return this;
  }

  public pending() {
    this._props.status = "PENDING";
    return this;
  }

  public pendingShopifyAccept() {
    this._props.status = "PENDING_SHOPIFY_ACCEPT";
    return this;
  }

  public pendingAccessToken() {
    this._props.status = "ACCEPTED";
    return this;
  }
  public complete() {
    this._props.status = "COMPLETE";
    return this;
  }
  public fail(reason: any) {
    this._props.status = "FAILED";
    this._props.failedReason = reason;
    return this;
  }

  public generateInstallLink(API_KEY: string, BASE_API_URL: string) {
    this._props.installLink = `https://${this._props.shop}/admin/oauth/authorize?client_id=${API_KEY}&scope=${this._props.scopes}&state=${this._props.nonce}&redirect_uri=${BASE_API_URL}/shopify/install`;
    this._props.status = "PENDING_SHOPIFY_ACCEPT";
    return this;
  }
  public generateAccessTokenRequestLink() {
    this._props.accessTokenLink = `https://${this._props.shop}/admin/oauth/access_token`;
    return this;
  }
}
