import { UUID } from '@shared/domain/ValueObjects';
import * as moment from 'moment';
import { AcceptShopifyInstallDto } from '../../dto/AcceptShopifyInstallDto';
import { InstallShopifyAccountDto } from '../../dto/InstallShopifyAccountDto';
import { ShopifyAccountInstallStatus } from './ShopifyAccountInstallStatus';
import * as crypto from 'crypto';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  DbShopifyAccountInstall,
  DbShopifyAccountInstallFailedReason,
  DbShopifyAccountInstallStatus,
} from '@shared/modules/prisma/models/ShopifyAccount';
import { isInteger, parseInt } from 'lodash';
import {
  ShopifyAccountInstallInitiated,
} from '../events/ShopifyAccountEvent';
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

  status: DbShopifyAccountInstallStatus;

  failedReason: DbShopifyAccountInstallFailedReason;

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

  status: DbShopifyAccountInstallStatus;
  failedReason: DbShopifyAccountInstallFailedReason;

  completedAt?: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class ShopifyAccountInstall {
  protected props: ShopifyAccountInstallProps;
  private constructor(props: ShopifyAccountInstallProps) {
    this.props = props;
  }

  get status() {
    return this.props.status;
  }

  get installLink() {
    return this.props.installLink;
  }
  get accessTokenLink() {
    return this.props.accessTokenLink;
  }

  get failed() {
    return this.status == ShopifyAccountInstallStatus.FAILED;
  }

  getProps(): IShopifyAccountInstall {
    const props: IShopifyAccountInstall = {
      id: this.props.id.value,
      shop: this.props.shop,
      accessToken: this.props.accessToken,
      timestamp: this.props.timestamp,
      hmac: this.props.hmac,
      nonce: this.props.nonce,
      status: this.props.status,
      scopes: this.props.scopes,
      authorizationCode: this.props.authorizationCode,
      shopifyAccountId: this.props.shopifyAccountId.value,
      installLink: this.props.installLink,
      accessTokenLink: this.props.accessTokenLink,
      failedReason: this.props.failedReason,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
    return props;
  }
  toDb(): DbShopifyAccountInstall {
    const props: DbShopifyAccountInstall = {
      id: this.props.id.value,
      shop: this.props.shop,
      accessToken: this.props.accessToken,
      timestamp: this.props.timestamp,
      hmac: this.props.hmac,
      nonce: this.props.nonce,
      status: this.props.status,
      scopes: this.props.scopes,
      authorizationCode: this.props.authorizationCode,
      shopifyAccountId: undefined,
      installLink: this.props.installLink,
      accessTokenLink: this.props.accessTokenLink,
      failedReason: this.props.failedReason,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
    return props;
  }
  public static fromDb(
    dbInstall: DbShopifyAccountInstall,
  ): ShopifyAccountInstall {
    try {
      const props: ShopifyAccountInstallProps = {
        id: UUID.from(dbInstall.id),
        shopifyAccountId: UUID.from(dbInstall.shopifyAccountId),
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
        `Unable To Load ShopifyAccount From Db`,
      );
    }
  }
  public static create(): ShopifyAccountInstall {
    const na = 'NOT_AVAILABLE';
    const now = moment().toDate();
    const defaultDate = moment().toDate().valueOf();
    const id = UUID.generate();
    const props: ShopifyAccountInstallProps = {
      id: id,
      shopifyAccountId: id,
      shop: na,
      hmac: na,
      timestamp: defaultDate,
      status: 'PENDING',
      failedReason: 'NONE',
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
    this.forShopifyAccount(shopifyAccountId)
      .forShop(dto.shop)
      .initiatedAt(timestamp)
      .withScopes(dto.scopes)
      .withHmac(dto.hmac)
      .generateNonce();

    return this;
  }

  public initiatedAt(timestamp: any) {
    this.props.timestamp = parseInt(timestamp);
    return this;
  }
  public forShop(shop: string) {
    this.props.shop = shop;
    return this;
  }

  public withHmac(hmac: string) {
    if (hmac) this.props.hmac = hmac;
    return this;
  }

  public forShopifyAccount(id: UUID) {
    this.props.shopifyAccountId = id;
    return this;
  }

  public withScopes(scopes: string) {
    this.props.scopes = scopes;
    return this;
  }
  public generateNonce() {
    this.props.nonce = moment(this.props.timestamp).valueOf();
    if (!isInteger(this.props.nonce)) {
      throw new UnprocessableEntityException(`NonceIsNotNumber`);
    }
    return this;
  }

  public confirmInstall(
    dto: AcceptShopifyInstallDto,
    SHOPIFY_API_SECRET: string,
  ) {
    if (dto.state != this.props.nonce) {
      throw new UnprocessableEntityException(
        `Unable to accept install: Invalid Nonce`,
      );
    }
    const message = `code=${dto.code}&shop=${dto.shop}&state=${dto.state}&timestamp=${dto.timestamp}`;
    const providedHmac = Buffer.from(dto.hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto
        .createHmac('sha256', SHOPIFY_API_SECRET)
        .update(message)
        .digest('hex'),
      'utf-8',
    );

    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      throw new UnprocessableEntityException(
        `Unable to accept install: Invalid HMAC`,
      );
    }
    return this;
  }

  accept(dto: AcceptShopifyInstallDto) {
    this.props.status = 'ACCEPTED';
    this.props.authorizationCode = dto.code;
    this.generateAccessTokenRequestLink();
    return this;
  }

  public withAccessToken(token: string) {
    this.props.accessToken = token;
    return this;
  }

  public pending() {
    this.props.status = 'PENDING';
    return this;
  }

  public pendingShopifyAccept() {
    this.props.status = 'PENDING_SHOPIFY_ACCEPT';
    return this;
  }

  public pendingAccessToken() {
    this.props.status = 'ACCEPTED';
    return this;
  }
  public complete() {
    this.props.status = 'COMPLETE';
    return this;
  }
  public fail(reason: DbShopifyAccountInstallFailedReason) {
    this.props.status = 'FAILED';
    this.props.failedReason = reason;
    return this;
  }

  public generateInstallLink(API_KEY: string, BASE_API_URL: string) {
    this.props.installLink = `https://${this.props.shop}/admin/oauth/authorize?client_id=${API_KEY}&scope=${this.props.scopes}&state=${this.props.nonce}&redirect_uri=${BASE_API_URL}/shopify/install`;
    this.props.status = 'PENDING_SHOPIFY_ACCEPT';
    return this;
  }
  public generateAccessTokenRequestLink() {
    this.props.accessTokenLink = `https://${this.props.shop}/admin/oauth/access_token`;
    return this;
  }
}
