import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query, QueryWithHelpers } from "mongoose";
import { BaseMongoRepository } from "@shared/mongo";
import { AzureTelemetryService } from "@shared/modules";
import { MongoSalesOrder, MongoSalesOrderDocument } from "./MongoSalesOrder";

@Injectable()
export class MongoOrdersRepository extends BaseMongoRepository<MongoSalesOrder> {
  private readonly logger: Logger = new Logger(MongoOrdersRepository.name);
  private async handle<T>(fn: () => T) {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
  constructor(
    @InjectModel(MongoSalesOrder.name)
    private readonly model: Model<MongoSalesOrderDocument>
  ) {
    super(model);
  }
  async findById(id: string): Promise<MongoSalesOrder> {
    return await this.handle<QueryWithHelpers<any, any>>(() =>
      this._model.findById(id)
    );
  }
  async update(doc: MongoSalesOrder): Promise<MongoSalesOrder> {
    return await this.handle<Query<any, any>>(() =>
      this._model.findByIdAndUpdate(doc, {
        useFindAndModify: true,
        upsert: true,
        new: true,
      })
    );
  }
}
