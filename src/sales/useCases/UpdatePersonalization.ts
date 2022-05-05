import { CatalogService } from "@catalog/services";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesLineItem, SalesOrder } from "@sales/domain";
import { LineItemPropertyDto } from "@sales/dto";
import { UseCase } from "@shared/domain";
import { AzureTelemetryService } from "@shared/modules";
import { SalesLineItemRepository } from "@sales/database/SalesLineItemRepository";

export class UpdatePersonalizationDto {
  orderId: string;
  lineItemId: string;
  personalization: LineItemPropertyDto[];
}
@Injectable({ scope: Scope.DEFAULT })
export class UpdatePersonalization
  implements UseCase<UpdatePersonalizationDto, SalesLineItem>
{
  private readonly logger: Logger = new Logger(UpdatePersonalization.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesLineItemRepository,
    public _catalog: CatalogService
  ) {}

  async execute(dto: UpdatePersonalizationDto): Promise<SalesLineItem> {
    this.logger.log(`Loading SalesOrder '${dto.lineItemId}'`);
    let lineItem = await this._repo.load(dto.lineItemId);
    this.logger.log(
      `Updating personalization for SalesLineItem '${dto.lineItemId}'`
    );
    await lineItem.updatePersonalization(dto.personalization);
    this.logger.log(`Saving SalesLineItem '${dto.lineItemId}'`);
    await this._repo.save(lineItem);
    lineItem = await this._repo.load(dto.lineItemId);
    return lineItem;
  }
}
