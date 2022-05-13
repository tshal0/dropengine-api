import { CatalogService } from "@catalog/services";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "../database/SalesOrderRepository";
import { AddressDto, LineItemPropertyDto } from "@sales/dto";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { EditCustomerDto } from "@sales/api";
import { SalesOrder } from "@sales/domain/SalesOrder";

export class UpdateCustomerInfoDto {
  orderId: string;
  customer: EditCustomerDto;
}
@Injectable({ scope: Scope.DEFAULT })
export class UpdateCustomerInfo
  implements UseCase<UpdateCustomerInfoDto, SalesOrder>
{
  private readonly logger: Logger = new Logger(UpdateCustomerInfo.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
    public _catalog: CatalogService
  ) {}

  async execute(dto: UpdateCustomerInfoDto): Promise<SalesOrder> {
    this.logger.log(`Loading SalesOrder '${dto.orderId}'`);
    let order = await this._repo.load(dto.orderId);
    this.logger.log(`Updating shippingAddress for SalesOrder '${dto.orderId}'`);
    await order.updateCustomerInfo(dto.customer);
    this.logger.log(`Saving SalesOrder '${dto.orderId}'`);
    await this._repo.save(order);
    order = await this._repo.load(dto.orderId);
    return order;
  }
}
