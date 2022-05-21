import { Injectable, Scope, Logger } from "@nestjs/common";
import { SalesOrderRepository } from "@sales/database";
import { SalesOrder } from "@sales/domain";
import { IAddress, UseCase } from "@shared/domain";

export class ChangeShippingAddressRequest {
  id: string;
  address: IAddress;
}

@Injectable({ scope: Scope.DEFAULT })
export class ChangeShippingAddress
  implements UseCase<ChangeShippingAddressRequest, SalesOrder>
{
  private readonly logger: Logger = new Logger(ChangeShippingAddress.name);
  constructor(private readonly _repo: SalesOrderRepository) {}

  async execute(request: ChangeShippingAddressRequest): Promise<SalesOrder> {
    let order = await this._repo.load(request.id);
    order.editShippingAddress({ address: request.address });
    return await this._repo.save(order);
  }
}
