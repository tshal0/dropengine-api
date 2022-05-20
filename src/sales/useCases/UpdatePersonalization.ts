import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";
import { SalesOrder } from "@sales/domain";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { UpdatePersonalizationDto } from "../dto/UpdatePersonalizationDto";

@Injectable({ scope: Scope.DEFAULT })
export class UpdatePersonalization
  implements UseCase<UpdatePersonalizationDto, SalesOrder>
{
  private readonly logger: Logger = new Logger(UpdatePersonalization.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
  ) {}

  async execute(dto: UpdatePersonalizationDto): Promise<SalesOrder> {
    this.logger.log(`Loading SalesOrder '${dto.orderId}'`);
    let salesOrder = await this._repo.load(dto.orderId);
    this.logger.log(`Updating personalization for SalesOrder '${dto.orderId}'`);
    // await salesOrder.updatePersonalization(dto);
    this.logger.log(`Saving SalesOrder '${dto.orderId}'`);
    await this._repo.save(salesOrder);
    salesOrder = await this._repo.load(dto.orderId);
    return salesOrder;
  }
}
