import { CatalogService } from "@catalog/services";
import { Injectable, Scope, Logger } from "@nestjs/common";
import { MongoDomainEventRepository } from "@sales/database/mongo/repositories/MongoDomainEventRepository";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";
import { SalesLineItem, SalesOrder, SalesOrderID } from "@sales/domain";
import { UseCase } from "@shared/domain";
import { DomainEvent } from "@shared/domain/events/DomainEvent";
import { AzureTelemetryService } from "@shared/modules";
import { UpdatePersonalizationDto } from "../dto/UpdatePersonalizationDto";

@Injectable({ scope: Scope.DEFAULT })
export class LoadEvents implements UseCase<string, DomainEvent<SalesOrder>[]> {
  private readonly logger: Logger = new Logger(LoadEvents.name);
  constructor(
    public _log: AzureTelemetryService,
    public _repo: SalesOrderRepository,
    public _events: MongoDomainEventRepository
  ) {}

  async execute(id: string): Promise<DomainEvent<SalesOrder>[]> {
    let e = await this._events.findByAggregateId(id);
    return e;
  }
}
