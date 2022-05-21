import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "@sales/database";
import { SalesOrder } from "@sales/domain";
import { UseCase } from "@shared/domain";
import { LineItemProperty } from "./PlaceOrder";

export class ChangePersonalizationRequest {
  id: string;
  lineNumber: number;
  personalization: LineItemProperty[];
}

@Injectable({ scope: Scope.DEFAULT })
export class ChangePersonalization
  implements UseCase<ChangePersonalizationRequest, SalesOrder>
{
  private readonly logger: Logger = new Logger(ChangePersonalization.name);
  constructor(private readonly _repo: SalesOrderRepository) {}

  async execute(request: ChangePersonalizationRequest): Promise<SalesOrder> {
    let order = await this._repo.load(request.id);
    order.editPersonalization({
      lineNumber: request.lineNumber,
      personalization: request.personalization,
    });
    return await this._repo.save(order);
  }
}
