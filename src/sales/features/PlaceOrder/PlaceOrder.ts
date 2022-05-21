import { Injectable, Logger, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain";

import { validate } from "class-validator";
import safeJsonStringify from "safe-json-stringify";
import { CatalogService, CatalogVariant } from "@catalog/services";
import { SalesOrder } from "@sales/domain";
import { SalesOrderRepository } from "@sales/database";
import { OrderPlacedDetails, PlacedOrderLineItem } from "@sales/domain/events";

import {
  PlaceOrderError,
  FailedToPlaceSalesOrderException,
  generateValidationError,
} from "./PlaceOrderError";
import {
  PlaceOrderRequest,
  PlaceOrderRequestLineItem,
} from "./PlaceOrderRequest";

@Injectable({ scope: Scope.DEFAULT })
export class PlaceOrder implements UseCase<PlaceOrderRequest, SalesOrder> {
  private readonly logger: Logger = new Logger(PlaceOrder.name);
  constructor(
    private readonly _repo: SalesOrderRepository,
    private readonly _catalog: CatalogService
  ) {}

  async execute(request: PlaceOrderRequest): Promise<SalesOrder> {
    try {
      await validateRequest(request);

      // Load Variants, Generate LineItems
      const lineItems: PlacedOrderLineItem[] = [];
      for (let i = 0; i < request.lineItems.length; i++) {
        const li = request.lineItems[i];
        const catalogVariant = await this.loadCatalogVariant(li);
        const cli = new PlacedOrderLineItem();
        cli.lineNumber = i + 1;
        cli.properties = li.properties;
        cli.quantity = li.quantity;
        cli.variant = catalogVariant;
        lineItems.push(cli);
      }

      const payload = new OrderPlacedDetails({
        accountId: request.accountId,
        orderName: request.orderName,
        orderNumber: request.orderNumber,
        orderDate: request.orderDate,
        customer: request.customer,
        shippingAddress: request.shippingAddress,
        billingAddress: request.billingAddress,
        lineItems: lineItems,
      });
      let order = new SalesOrder();
      let event = order.placed(payload);
      return await this._repo.save(order);
    } catch (error) {
      if (process.env.DEBUG)
        this.logger.debug(safeJsonStringify(error, null, 2));
      throw error;
    }
  }
  public async loadCatalogVariant(
    li: PlaceOrderRequestLineItem
  ): Promise<CatalogVariant> {
    return await this._catalog.lookupVariantBySkuOrId({
      id: li.variantId,
      sku: li.sku,
    });
  }
}

async function validateRequest(dto: PlaceOrderRequest) {
  const dtoErrors = await validate(dto, {
    validationError: { target: false },
  });
  if (dtoErrors.length) {
    const message = `Validation errors found.`;
    const valErrors = generateValidationError(dtoErrors);
    throw new FailedToPlaceSalesOrderException(
      dto,
      message,
      PlaceOrderError.InvalidSalesOrder,
      valErrors
    );
  }
}
