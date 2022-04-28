import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from "@nestjs/common";
import moment from "moment";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { SalesOrder } from "@sales/domain";
import { CreateOrderLineItemApiDto } from "@sales/api";
import { SalesOrderRepository } from "@sales/database";
import { CatalogService, CatalogVariant } from "@catalog/services";

import { CreateOrderDto, CreateLineItemDto } from "@sales/dto";
import { validate } from "class-validator";
import { CreateSalesOrderDto } from "./CreateSalesOrderDto";
import { CreateSalesOrderLineItemDto } from "./CreateSalesOrderLineItemDto";
import safeJsonStringify from "safe-json-stringify";

@Injectable({ scope: Scope.DEFAULT })
export class CreateSalesOrder
  implements UseCase<CreateSalesOrderDto, SalesOrder>
{
  private readonly logger: Logger = new Logger(CreateSalesOrder.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
    public _catalog: CatalogService
  ) {}

  async execute(dto: CreateSalesOrderDto): Promise<SalesOrder> {
    try {
      await this.validateUseCaseDto(dto);
      this.validateUserAuthorization(dto);
      let lineItems = await Promise.all(
        dto.lineItems.map(
          async (li, i) => await this.generateLineItemDto(li, i, dto)
        )
      );

      const createOrderDto: CreateOrderDto = new CreateOrderDto(dto, lineItems);
      await this.validateDomainDto(createOrderDto);
      let result = await SalesOrder.create(createOrderDto);

      let order = result;
      return await this._repo.save(order);
    } catch (error) {
      this.logger.error(error);
      if (weRecognize(error)) throw error;
      else throw new FailedToPlaceSalesOrderException(dto, error);
    }

    function weRecognize(error: any) {
      return error instanceof CreateSalesOrderException;
    }
  }

  public async generateLineItemDto(
    li: CreateSalesOrderLineItemDto,
    i: number,
    dto: CreateSalesOrderDto
  ) {
    guardLineItemNotNull();
    const lineNumber = generateLineNumber();
    const quantity = li.quantity;
    const properties = generateLineItemProperties();
    const catalogVariant = await this.loadCatalogVariant(li);
    guardCatalogVariantNotNull();

    let lineItem: CreateLineItemDto = {
      lineNumber: lineNumber,
      quantity: quantity,
      variant: catalogVariant,
      properties: properties,
    };
    return lineItem;

    function guardCatalogVariantNotNull() {
      if (catalogVariant === null || catalogVariant === undefined) {
        throw new FailedToPlaceSalesOrderException(
          dto,
          `CatalogVariant not found for LineItem '${generateLineNumber()}'.`,
          [{ sku: li.sku, id: li.variantId }],
          CreateSalesOrderError.MissingLineItem
        );
      }
    }

    function guardLineItemNotNull() {
      if (li === undefined || li === null) {
        throw new FailedToPlaceSalesOrderException(
          dto,
          `LineItem '${generateLineNumber()}' was null or undefined.`,
          null,
          CreateSalesOrderError.MissingLineItem
        );
      }
    }

    function generateLineItemProperties() {
      return li.lineItemProperties || [];
    }

    function generateLineNumber() {
      return i + 1;
    }
  }

  public validateUserAuthorization(dto: CreateSalesOrderDto) {
    let user = dto.user;
    if (!user.canManageOrders(dto.accountId)) {
      throw new FailedToPlaceSalesOrderException(
        dto,
        `User '${user.email}' not authorized to place orders for given Account: '${dto.accountId}'`,
        null,
        CreateSalesOrderError.UserNotAuthorizedForAccount
      );
    }
  }

  public async validateUseCaseDto(dto: CreateSalesOrderDto) {
    const dtoErrors = await validate(dto, {
      validationError: { target: false },
    });
    if (dtoErrors.length) {
      const message = `Validation errors found.`;
      throw new FailedToPlaceSalesOrderException(
        dto,
        message,
        dtoErrors,
        CreateSalesOrderError.InvalidSalesOrder
      );
    }
  }
  public async validateDomainDto(createOrderDto: CreateOrderDto) {
    const validationErrors = await validate(createOrderDto, {
      validationError: { target: false },
    });
    console.log(safeJsonStringify(validationErrors, null, 2));
    if (validationErrors.length) {
      const reason = `Validation errors found.`;
      throw new FailedToPlaceSalesOrderException(
        createOrderDto,
        reason,
        validationErrors,
        CreateSalesOrderError.InvalidSalesOrder
      );
    }
  }

  public async loadCatalogVariant(
    li: CreateOrderLineItemApiDto
  ): Promise<CatalogVariant> {
    const variantResult = hasSku()
      ? await this.loadVariantBySku(li.sku)
      : await this.loadVariantById(li.variantId);

    return variantResult;

    function hasSku() {
      return li.sku != null;
    }
  }
  public async loadVariantBySku(sku: string): Promise<CatalogVariant> {
    return await this._catalog.loadVariantBySku({ sku });
  }

  public async loadVariantById(id: string): Promise<CatalogVariant> {
    return await this._catalog.loadVariantById({ id });
  }
}

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
  MissingLineItem = "MissingLineItem",
  FailedToSaveSalesOrder = "FailedToSaveSalesOrder",
  UserNotAuthorizedForAccount = "UserNotAuthorizedForAccount",
  AccountNotFound = "AccountNotFound",
  FailedToLoadVariantBySku = "FailedToLoadVariantBySku",
  FailedToLoadVariantById = "FailedToLoadVariantById",
}

export class CreateSalesOrderException extends InternalServerErrorException {
  public type: CreateSalesOrderError;
  constructor(objectOrError: any, description: string) {
    super(objectOrError, description);
  }
}

export class FailedToPlaceSalesOrderException extends CreateSalesOrderException {
  constructor(
    dto: CreateSalesOrderDto | CreateOrderDto,
    reason: any,
    inner: any[] = [],
    type: CreateSalesOrderError = CreateSalesOrderError.UnknownSalesError
  ) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          `Failed to place SalesOrder for order ` +
          `'${dto.orderName}': ` +
          `${reason?.message || reason}`,
        timestamp: moment().toDate(),
        error: type,
        details: {
          orderName: dto.orderName,
          orderNumber: dto.orderNumber,
          reason,
          inner,
        },
      },
      `Failed to place SalesOrder for order ` +
        `'${dto.orderName}': ` +
        `${reason?.message || reason}`
    );
  }
}
