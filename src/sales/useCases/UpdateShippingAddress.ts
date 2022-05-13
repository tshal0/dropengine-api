import { CatalogService } from "@catalog/services";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "../database/SalesOrderRepository";
import { AddressDto, LineItemPropertyDto } from "@sales/dto";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { SalesOrder } from "@sales/domain/SalesOrder";

export class UpdateShippingAddressDto {
  orderId: string;
  shippingAddress: AddressDto;
}
@Injectable({ scope: Scope.DEFAULT })
export class UpdateShippingAddress
  implements UseCase<UpdateShippingAddressDto, SalesOrder>
{
  private readonly logger: Logger = new Logger(UpdateShippingAddress.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
    public _catalog: CatalogService
  ) {}

  async execute(dto: UpdateShippingAddressDto): Promise<SalesOrder> {
    this.logger.log(`Loading SalesOrder '${dto.orderId}'`);
    let order = await this._repo.load(dto.orderId);
    this.logger.log(`Updating shippingAddress for SalesOrder '${dto.orderId}'`);
    await order.updateShippingAddress({ shippingAddress: dto.shippingAddress });
    this.logger.log(`Saving SalesOrder '${dto.orderId}'`);
    await this._repo.save(order);
    order = await this._repo.load(dto.orderId);
    return order;
  }
}
