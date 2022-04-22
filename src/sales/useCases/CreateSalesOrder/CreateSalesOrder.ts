import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import moment from "moment";
import { Result, ResultError, UseCase } from "@shared/domain";
import { AzureLoggerService } from "@shared/modules";
import { SalesOrder } from "@sales/domain";

import { CreateOrderApiDto, CreateOrderLineItemApiDto } from "@sales/api";
import { SalesOrderRepository } from "@sales/database";
import { CatalogService, CatalogVariant } from "@catalog/services";

import { toNumber } from "lodash";
import { CreateOrderDto, CreateLineItemDto } from "@sales/dto";

@Injectable({ scope: Scope.DEFAULT })
export class CreateSalesOrder
  implements UseCase<CreateOrderApiDto, SalesOrder>
{
  constructor(
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
      let results = await Promise.all(tasks);

      const failures = results
        .filter((res) => res.isFailure)
        .map((res) => res.error);
      const lineItems = results
        .filter((r) => r.isSuccess)
        .map((r) => r.value());

      if (failures.length) {
        //TODO: Handle FailedToLoadLineItemVariants
        return Result.fail(this.failedToLoadLineItemVariants(failures, dto));
      }

      const createOrderDto: CreateOrderDto = new CreateOrderDto(dto, lineItems);

      let result = await SalesOrder.create(createOrderDto);

      if (result.isFailure) {
        //TODO: FailedToCreateSalesOrder: InvalidOrder
        return Result.fail(this.failedToCreateSalesOrder(result, dto));
      }
      let order = result.value();
      result = await this._repo.save(order);
      if (result.isFailure) {
        //TODO: FailedToSaveSalesOrder
        return Result.fail(this.failedToSaveSalesOrder(result, dto));
      }
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }

  private async generateLineItemDto(li: CreateOrderLineItemApiDto, i: number) {
    try {
      const lineNumber = i + 1;
      const quantity = li.quantity;
      const properties = li?.lineItemProperties || [];
      const result = await this.loadCatalogVariant(li);
      if (result.isFailure) {
        return Result.fail<CreateLineItemDto>(result.error);
      }
      const catalogVariant = result.value();

      let lineItem: CreateLineItemDto = {
        lineNumber: lineNumber,
        quantity: quantity,
        variant: catalogVariant,
        properties: properties,
      };
      return Result.ok(lineItem);
    } catch (error) {
      return Result.fail<CreateLineItemDto>(error);
    }
  }
  private async loadCatalogVariant(li: CreateOrderLineItemApiDto) {
    const hasSku = toNumber(li?.sku?.length && li.sku.length > 0);
    const variantResult = hasSku
      ? await this.loadVariantBySku(li)
      : await this.loadVariantById(li);

    return variantResult;
  }
  private async loadVariantBySku(li: CreateOrderLineItemApiDto) {
    return await this._catalog.loadLineItemVariantBySku({
      sku: li.sku,
    });
  }
  private async loadVariantById(li: CreateOrderLineItemApiDto) {
    return await this._catalog.loadLineItemVariantById({
      id: li.variantId,
    });
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
