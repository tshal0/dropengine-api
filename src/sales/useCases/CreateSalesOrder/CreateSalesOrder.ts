import {
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import moment from "moment";
import { Result, ResultError, UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { SalesOrder } from "@sales/domain";

import { CreateOrderApiDto, CreateOrderLineItemApiDto } from "@sales/api";
import { SalesOrderRepository } from "@sales/database";
import { CatalogService, CatalogVariant } from "@catalog/services";

import { toNumber } from "lodash";
import { CreateOrderDto, CreateLineItemDto } from "@sales/dto";
import { validate } from "class-validator";

/**
 * CSO ErrorTypes:
 * FailedToLoadVariant (conection failed, SKU or ID is invalid, etc)
 * InvalidLineItem (Personalization missing, invalid quantity, etc )
 * InvalidSalesOrder (Invalid AccountId/Name/Number/Date/LineItem(s)/Customer/ShippingAddress)
 * FailedToSaveSalesOrder (DbConnection failed)
 */
export enum CreateSalesOrderError {
  UnknownSalesError = "UnknownSalesError",
  InvalidSalesOrder = "InvalidSalesOrder",
  InvalidLineItem = "InvalidLineItem",
  FailedToSaveSalesOrder = "FailedToSaveSalesOrder",
  UserAccountPermissionsNotFound = "UserAccountPermissionsNotFound",
  AccountNotFound = "AccountNotFound",
  FailedToLoadVariant = "FailedToLoadVariant",
}

export class CreateSalesOrderException extends InternalServerErrorException {
  public type: CreateSalesOrderError;
  constructor(objectOrError: any, description: string) {
    super(objectOrError, description);
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class CreateSalesOrder
  implements UseCase<CreateOrderApiDto, SalesOrder>
{
  constructor(
    private _log: AzureTelemetryService,
    private _repo: SalesOrderRepository,
    private _catalog: CatalogService
  ) {}
  get llog() {
    return `[${moment()}][${CreateSalesOrder.name}]`;
  }

  async execute(dto: CreateOrderApiDto): Promise<Result<SalesOrder>> {
    try {
      // TODO: LoadLineItemVariants

      let tasks = dto.lineItems.map(
        async (li, i) => await this.generateLineItemDto(li, i)
      );
      // If any fail, they will throw
      let lineItems = await Promise.all(tasks);

      const createOrderDto: CreateOrderDto = new CreateOrderDto(dto, lineItems);
      const validationErrors = await validate(createOrderDto, {
        validationError: { target: false },
      });
      if (validationErrors.length) {
        const message = `Failed to place SalesOrder. Validation errors found.`;
        throw new CreateSalesOrderException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: message,
            timestamp: moment().toDate(),
            error: CreateSalesOrderError.InvalidSalesOrder,
            details: {
              orderName: dto.orderName,
              orderNumber: dto.orderNumber,
              validationErrors: validationErrors,
            },
          },
          message
        );
      }
      let result = await SalesOrder.create(createOrderDto);

      if (result.isFailure) {
        const message = `Failed to place SalesOrder. Validation errors found.`;
        throw new CreateSalesOrderException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: message,
            timestamp: moment().toDate(),
            error: CreateSalesOrderError.InvalidSalesOrder,
            details: {
              orderName: dto.orderName,
              orderNumber: dto.orderNumber,
              validationErrors: result.error.inner,
            },
          },
          message
        );
      }
      let order = result.value();
      result = await this._repo.save(order);
      if (result.isFailure) {
        const message = `Failed to save SalesOrder. See inner for details.`;
        throw new CreateSalesOrderException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: message,
            timestamp: moment().toDate(),
            error: CreateSalesOrderError.FailedToSaveSalesOrder,
            details: {
              orderName: dto.orderName,
              orderNumber: dto.orderNumber,
              validationErrors: result.error.inner,
            },
          },
          message
        );
      }
      return result;
    } catch (error) {
      if (error instanceof CreateSalesOrderException) {
        throw error;
      }
      const message = `Failed to place SalesOrder for order '${
        dto.orderName
      }': ${error?.message || error}`;
      throw new CreateSalesOrderException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: message,
          timestamp: moment().toDate(),
          error: CreateSalesOrderError.UnknownSalesError,
          details: {
            orderName: dto.orderName,
            orderNumber: dto.orderNumber,
            error,
          },
        },
        message
      );
    }
  }

  private async generateLineItemDto(
    li: CreateOrderLineItemApiDto,
    i: number
  ): Promise<CreateLineItemDto> {
    try {
      const lineNumber = i + 1;
      const quantity = li.quantity;
      const properties = li?.lineItemProperties || [];
      const catalogVariant = await this.loadCatalogVariant(li);

      let lineItem: CreateLineItemDto = {
        lineNumber: lineNumber,
        quantity: quantity,
        variant: catalogVariant,
        properties: properties,
      };
      return lineItem;
    } catch (error) {
      const message = `Failed to generate LineItem '${
        li.variantId || li.sku
      }': ${error?.message || error}`;
      throw new CreateSalesOrderException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: message,
          timestamp: moment().toDate(),
          error: CreateSalesOrderError.InvalidLineItem,
          details: { SKU: li.sku, inner: [error] },
        },
        message
      );
    }
  }
  private async loadCatalogVariant(
    li: CreateOrderLineItemApiDto
  ): Promise<CatalogVariant> {
    const hasSku = toNumber(li?.sku?.length && li.sku.length > 0);
    const variantResult = hasSku
      ? await this.loadVariantBySku(li)
      : await this.loadVariantById(li);

    return variantResult;
  }
  private async loadVariantBySku(
    li: CreateOrderLineItemApiDto
  ): Promise<CatalogVariant> {
    let res = await this._catalog
      .loadLineItemVariantBySku({
        sku: li.sku,
      })
      .catch((err) => {
        let error = loadVariantBySkuError(err, li);
        return Result.fail<CatalogVariant>(new ResultError(error, []), li.sku);
      });
    if (res.isFailure) {
      let err = res.error;
      this._log.debug(JSON.stringify(err, null, 2));
      const message = `Failed to load ProductVariant '${li.sku}'`;
      throw new CreateSalesOrderException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: message,
          timestamp: moment().toDate(),
          error: CreateSalesOrderError.FailedToLoadVariant,
          details: { SKU: li.sku, inner: err?.inner },
        },
        message
      );
    }
    return res.value();
  }
  private async loadVariantById(
    li: CreateOrderLineItemApiDto
  ): Promise<CatalogVariant> {
    let res = await this._catalog
      .loadLineItemVariantById({
        id: li.variantId,
      })
      .catch((err) => {
        let error = loadVariantByIdError(err, li);
        return Result.fail<CatalogVariant>(
          new ResultError(error, []),
          li.variantId
        );
      });
    if (res.isFailure) {
      let err = res.error;
      this._log.debug(JSON.stringify(err, null, 2));
      const message = `Failed to load ProductVariant '${li.variantId}'`;
      throw new CreateSalesOrderException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: message,
          timestamp: moment().toDate(),
          error: CreateSalesOrderError.FailedToLoadVariant,
          details: { variantId: li.variantId, inner: err?.inner },
        },
        message
      );
    }
    return res.value();
  }
  private failedToLoadLineItemVariants(
    failures: ResultError[],
    dto: CreateOrderApiDto
  ): ResultError {
    return new ResultError(
      new Error(`FailedToLoadLineItemVariants`),
      failures,
      dto
    );
  }

  private failedToSaveSalesOrder(
    result: Result<SalesOrder>,
    dto: CreateOrderApiDto
  ): ResultError {
    return new ResultError(
      new Error(`FailedToSaveSalesOrder`),
      [result.error],
      dto
    );
  }
  private failedToCreateSalesOrder(
    result: Result<SalesOrder>,
    dto: CreateOrderApiDto
  ): ResultError {
    return new ResultError(
      new Error(`FailedToCreateSalesOrder`),
      [result.error],
      dto
    );
  }
}
function loadVariantByIdError(err: any, li: CreateOrderLineItemApiDto) {
  return new Error(
    err?.message ||
      err ||
      `CatalogServiceError: Failed to load variant by id '${li.variantId}'`
  );
}
function loadVariantBySkuError(err: any, li: CreateOrderLineItemApiDto) {
  return new Error(
    err?.message ||
      err ||
      `CatalogServiceError: Failed to load variant by SKU '${li.variantId}'`
  );
}
