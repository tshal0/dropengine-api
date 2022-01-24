import { ConflictException, Injectable } from '@nestjs/common';
import { ResultError, Result } from '@shared/domain/Result';
import { UUID } from '@shared/domain/ValueObjects';
import { EntityAlreadyExistsException } from '@shared/exceptions/entityalreadyexists.exception';
import { EntityNotFoundException } from '@shared/exceptions/entitynotfound.exception';

import * as moment from 'moment';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import { DbShopifyAccount } from '@shared/modules/prisma/models/ShopifyAccount';
import { ConnectShopifyAccountDto } from '../dto/ConnectShopifyAccountDto';
import { ShopifyAccount } from '../domain/entities/ShopifyAccount';
export class ShopifyAccountNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `ShopifyAccount not found with ID: ${id}`,
      id,
      `SHOPIFY_ACCOUNT_NOT_FOUND`,
    );
  }
}
export class ShopifyAccountNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `ShopifyAccount not found with Origin: ${id}`,
      id,
      `SHOPIFY_ACCOUNT_NOT_FOUND`,
    );
  }
}
export class ShopifyAccountDuplicateShopOrigin extends ConflictException {
  constructor(id: string) {
    super(
      `ShopifyAccount found with Origin: ${id}`,
      `SHOPIFY_ACCOUNT_DUPLICATE_FOUND`,
    );
  }
}

@Injectable()
export class DbShopifyAccountsRepository {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly db: PrismaService,
  ) {}
  get llog() {
    return `[${moment()}][${DbShopifyAccountsRepository.name}]`;
  }
  private static errorResult<T>(error: any, value: any) {
    const err = new Error(error?.message || error);
    const resultError = new ResultError(err, [], value);
    const result = Result.fail<T>(resultError);
    return result;
  }

  async exists(id: UUID): Promise<boolean> {
    const result = await this.db.shopifyAccount
      .findFirst({
        where: {
          id: id.value,
        },
        rejectOnNotFound: true,
      })
      .then((shopifyAccount) => {
        return Result.ok(shopifyAccount);
      })
      .catch((err) => {
        return DbShopifyAccountsRepository.errorResult<DbShopifyAccount>(
          err,
          id,
        );
      });
    return result.isSuccess;
  }
  async existsByShopOrigin(origin: string): Promise<boolean> {
    const result = await this.db.shopifyAccount
      .findFirst({
        where: {
          shopOrigin: origin,
        },
        rejectOnNotFound: true,
      })
      .then((shopifyAccount) => {
        return Result.ok(shopifyAccount);
      })
      .catch((err) => {
        return DbShopifyAccountsRepository.errorResult<DbShopifyAccount>(
          err,
          origin,
        );
      });
    return result.isSuccess;
  }

  async findById(id: UUID): Promise<ShopifyAccount> {
    try {
      const result = await this.db.shopifyAccount
        .findFirst({
          where: {
            id: id.value,
          },
          include: {
            events: true,
            installation: {},
          },
          rejectOnNotFound: true,
        })
        .then((shopifyAccount) => {
          return Result.ok<DbShopifyAccount>(shopifyAccount);
        })
        .catch((err) => {
          this.logger.error(err);
          throw err;
        });

      if (result.isSuccess) {
        const entity = result.getValue();
        const shopifyAccount = ShopifyAccount.init(entity);
        return shopifyAccount;
      } else {
        throw result.error;
      }
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to find aggregate ${id.value}`);
      if (err.name == `NotFoundError`) {
        throw new ShopifyAccountNotFoundException(id.value);
      }
      throw err;
    }
  }
  async findByShopOrigin(origin: string): Promise<ShopifyAccount> {
    this.logger.debug(`${this.llog} Loading aggregate by origin...`);
    try {
      const result = await this.db.shopifyAccount
        .findFirst({
          where: {
            shopOrigin: origin,
          },
          include: { events: false, installation: true },
          rejectOnNotFound: true,
        })
        .then((shopifyAccount) => {
          return shopifyAccount;
        })
        .catch((err) => {
          throw err;
        });

      const shopifyAccount = ShopifyAccount.init(result);
      return shopifyAccount;
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to load aggregate ${origin}`);
      throw err;
    }
  }
  async findAll(): Promise<ShopifyAccount[]> {
    this.logger.debug(`${this.llog} Loading aggregate by origin...`);
    try {
      const result = await this.db.shopifyAccount
        .findMany({
          include: { events: true, installation: true },
        })
        .then((shopifyAccount) => {
          return shopifyAccount;
        })
        .catch((err) => {
          throw err;
        });

      const shopifyAccounts = result.map((r) => ShopifyAccount.init(r));
      return shopifyAccounts;
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to load aggregate ${origin}`);
      throw err;
    }
  }
  async loadAggregate(id: UUID): Promise<ShopifyAccount> {
    this.logger.debug(`${this.llog} Loading aggregate...`);
    try {
      const result = await this.db.shopifyAccount
        .findFirst({
          where: {
            id: id.value,
          },
          include: {
            events: false,
            installation: true,
          },
          rejectOnNotFound: true,
        })
        .then((shopifyAccount) => {
          return Result.ok<DbShopifyAccount>(shopifyAccount);
        })
        .catch((err) => {
          throw err;
        });

      if (result.isSuccess) {
        const entity = result.getValue();
        const shopifyAccount = ShopifyAccount.init(entity);
        return shopifyAccount;
      }
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to load aggregate ${id.value}`);
      throw err;
    }
  }

  async create(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount> {
    try {
      const props = shopifyAccount.toDb();
      const id = props.id;

      const shopifyAccountTrx = this.db.shopifyAccount.create({
        data: {
          ...props,
          installation: {
            create: {
              ...props.installation,
            },
          },
          events: {
            createMany: { data: props.events },
          },
        },
        include: {
          events: true,
          installation: true,
        },
      });

      const result = await this.db
        .$transaction([shopifyAccountTrx])
        .then(([shopifyAccount]) => {
          this.logger.debug(
            `${this.llog}Successfully persisted shopifyAccount ${shopifyAccount.id}`,
          );
          return Result.ok<DbShopifyAccount>(shopifyAccount);
        })
        .catch((err) => {
          const error = new Error(err?.name ?? err?.message);
          this.logger.error(error.message, error.stack);
          throw err;
        });
      if (result.isSuccess) {
        const entity = result.getValue();
        const shopifyAccount = ShopifyAccount.init(entity);
        return shopifyAccount;
      } else {
        this.logger.error(`${this.llog} Failed To Save ShopifyAccount ${id}`);
        throw result.error;
      }
    } catch (err: any) {
      const error = new Error(err?.name ?? err?.message);
      this.logger.error(error.message, error.stack);
      this.logger.debug(JSON.stringify(error, null, 2));
      throw err;
    }
  }
  async save(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount> {
    try {
      const props = shopifyAccount.toDb();
      const id = props.id;

      const shopifyAccountTrx = this.db.shopifyAccount.update({
        where: {
          id: id,
        },
        data: {
          installation: {
            update: {
              ...props.installation,
            },
          },
          events: {
            createMany: { data: props.events },
          },
        },
        include: {
          events: false,
          installation: true,
        },
      });

      const result = await this.db
        .$transaction([shopifyAccountTrx])
        .then(([shopifyAccount]) => {
          this.logger.debug(
            `${this.llog}Successfully persisted shopifyAccount ${shopifyAccount.id}`,
          );
          return Result.ok<DbShopifyAccount>(shopifyAccount);
        })
        .catch((err) => {
          const error = new Error(err?.name ?? err?.message);
          this.logger.error(error.message, error.stack);
          throw err;
        });
      if (result.isSuccess) {
        const entity = result.getValue();
        const shopifyAccount = ShopifyAccount.init(entity);
        return shopifyAccount;
      } else {
        this.logger.error(`${this.llog} Failed To Save ShopifyAccount ${id}`);
        throw result.error;
      }
    } catch (err: any) {
      const error = new Error(err?.name ?? err?.message);
      this.logger.error(error.message, error.stack);
      this.logger.debug(JSON.stringify(error, null, 2));
      throw err;
    }
  }

  async delete(id: UUID): Promise<Result<boolean>> {
    const shopifyAccountId = id.value;
    const result = await this.db.shopifyAccount
      .delete({
        where: {
          id: shopifyAccountId,
        },
      })
      .then((shopifyAccount) => {
        return Result.ok<DbShopifyAccount>(shopifyAccount as DbShopifyAccount);
      })
      .catch((err) => {
        return Result.fail(err);
      });
    try {
      if (result.isSuccess) {
        return Result.ok();
      } else {
        return Result.fail(result.error, shopifyAccountId);
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
