import { AuthService } from "@auth/auth.service";
import { MyEasySuiteOrderPlaced } from "@myeasysuite/domain/events";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain";
import { MyEasySuiteClient } from "../MyEasySuiteClient";

export class HandleOrderPlacedDto {
  orderId: string;
  eventName: string;
}
@Injectable({ scope: Scope.DEFAULT })
export class HandleOrderPlaced implements UseCase<HandleOrderPlacedDto, void> {
  private readonly logger: Logger = new Logger(HandleOrderPlaced.name);
  constructor(
    private readonly _client: MyEasySuiteClient,
    private readonly _auth: AuthService,
    private _bus: EventEmitter2
  ) {}

  async execute(dto: HandleOrderPlacedDto): Promise<void> {
    this.logger.debug(`[RECEIVED] ${HandleOrderPlaced.name} '${dto.orderId}'`);
    let order = await this._client.getOrderById(dto.orderId);

    let $e = new MyEasySuiteOrderPlaced(order.order_id, order);
    this.logger.debug(`[EMIT] ${$e.eventName} '${$e.aggregateId}'`);
    await this._bus.emitAsync($e.eventName, $e);
  }
}
