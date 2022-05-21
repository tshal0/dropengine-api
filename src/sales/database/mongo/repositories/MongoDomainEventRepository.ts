import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseMongoRepository } from "@shared/mongo";
import {
  MongoDomainEvent,
  MongoDomainEventDocument,
} from "../schemas/MongoDomainEvent";

@Injectable()
export class MongoDomainEventRepository extends BaseMongoRepository<MongoDomainEvent> {
  private readonly logger: Logger = new Logger(MongoDomainEventRepository.name);

  constructor(
    @InjectModel(MongoDomainEvent.name)
    private readonly model: Model<MongoDomainEventDocument>
  ) {
    super(model);
  }
  async findByAggregateId(id: string): Promise<MongoDomainEvent[]> {
    return await this._model.find({ aggregateId: id }).lean();
  }
}
