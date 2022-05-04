import { CatalogService } from "@catalog/services";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "@sales/database";
import { SalesOrder } from "@sales/domain";
import { LineItemPropertyDto } from "@sales/dto";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";

export class UpdatePersonalizationDto {
  orderId: string;
  lineItemId: string;
  personalization: LineItemPropertyDto[];
}
@Injectable({ scope: Scope.DEFAULT })
export class UpdatePersonalization
  implements UseCase<UpdatePersonalizationDto, SalesOrder>
{
  private readonly logger: Logger = new Logger(UpdatePersonalization.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
    public _catalog: CatalogService
  ) {}

  async execute(dto: UpdatePersonalizationDto): Promise<SalesOrder> {
    this.logger.log(`Loading SalesOrder '${dto.orderId}'`);
    let order = await this._repo.load(dto.orderId);
    this.logger.log(
      `Updating personalization for SalesLineItem '${dto.lineItemId}'`
    );
    order.updatePersonalization({
      lineItemId: dto.lineItemId,
      personalization: dto.personalization,
    });
    this.logger.log(`Saving SalesOrder '${dto.orderId}'`);
    await this._repo.save(order);
    order = await this._repo.load(dto.orderId);
    return order;
  }
}
