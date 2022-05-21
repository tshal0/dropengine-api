import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "@sales/database";
import { SalesOrder } from "@sales/domain";
import { UseCase } from "@shared/domain";

export class ChangeCustomerInfoRequest {
  id: string;
  customer: { name: string; email: string };
}

@Injectable({ scope: Scope.DEFAULT })
export class ChangeCustomerInfo
  implements UseCase<ChangeCustomerInfoRequest, SalesOrder>
{
  private readonly logger: Logger = new Logger(ChangeCustomerInfo.name);
  constructor(private readonly _repo: SalesOrderRepository) {}

  async execute(request: ChangeCustomerInfoRequest): Promise<SalesOrder> {
    let order = await this._repo.load(request.id);
    order.editCustomer(request.customer);
    return await this._repo.save(order);
  }
}
