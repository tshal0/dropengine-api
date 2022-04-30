import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityAlreadyExistsException } from "@shared/exceptions/entityalreadyexists.exception";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ShopifyAccount } from "../domain/entities/ShopifyAccount";
export class ShopifyAccountNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `ShopifyAccount not found with ID: ${id}`,
      id,
      `SHOPIFY_ACCOUNT_NOT_FOUND`
    );
  }
}
export class ShopifyAccountNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `ShopifyAccount not found with Origin: ${id}`,
      id,
      `SHOPIFY_ACCOUNT_NOT_FOUND`
    );
  }
}
export class ShopifyAccountDuplicateShopOrigin extends ConflictException {
  constructor(id: string) {
    super(
      `ShopifyAccount found with Origin: ${id}`,
      `SHOPIFY_ACCOUNT_DUPLICATE_FOUND`
    );
  }
}

export interface IDbShopifyAccountRepository {
  exists(id: UUID): Promise<boolean>;
  existsByShopOrigin(origin: string): Promise<boolean>;
  findById(id: UUID): Promise<ShopifyAccount>;
  findByShopOrigin(origin: string): Promise<ShopifyAccount>;
  findAll(): Promise<ShopifyAccount[]>;
  loadAggregate(id: UUID): Promise<ShopifyAccount>;
  create(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount>;
  save(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount>;
  delete(id: UUID): Promise<Result<boolean>>;
}

@Injectable()
export class DbShopifyAccountsRepository
  implements IDbShopifyAccountRepository
{
  private readonly logger: Logger = new Logger(DbShopifyAccountsRepository.name);
  constructor() {}
  exists(id: UUID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  existsByShopOrigin(origin: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  findById(id: UUID): Promise<ShopifyAccount> {
    throw new Error("Method not implemented.");
  }
  findByShopOrigin(origin: string): Promise<ShopifyAccount> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<ShopifyAccount[]> {
    throw new Error("Method not implemented.");
  }
  loadAggregate(id: UUID): Promise<ShopifyAccount> {
    throw new Error("Method not implemented.");
  }
  create(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount> {
    throw new Error("Method not implemented.");
  }
  save(shopifyAccount: ShopifyAccount): Promise<ShopifyAccount> {
    throw new Error("Method not implemented.");
  }
  delete(id: UUID): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
  get llog() {
    return `[${moment()}][${DbShopifyAccountsRepository.name}]`;
  }
  private static errorResult<T>(error: any, value: any) {
    const err = new Error(error?.message || error);
    const resultError = new ResultError(err, [], value);
    const result = Result.fail<T>(resultError);
    return result;
  }
}
