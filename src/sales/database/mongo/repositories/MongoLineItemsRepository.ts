import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query, QueryWithHelpers } from "mongoose";
import { BaseMongoRepository } from "@shared/mongo";
import { MongoSalesLineItem, MongoSalesLineItemDocument } from "../schemas";

@Injectable()
export class MongoLineItemsRepository extends BaseMongoRepository<MongoSalesLineItem> {
  private readonly logger: Logger = new Logger(MongoLineItemsRepository.name);
  private async handle<T>(fn: () => T) {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
  constructor(
    @InjectModel(MongoSalesLineItem.name)
    private readonly model: Model<MongoSalesLineItemDocument>
  ) {
    super(model);
  }
  async findById(id: string): Promise<MongoSalesLineItem> {
    return await this.handle<QueryWithHelpers<any, any>>(() =>
      this._model.findById(id)
    );
  }
  async update(doc: MongoSalesLineItem): Promise<MongoSalesLineItem> {
    return await this.handle<Query<any, any>>(() =>
      this._model.findByIdAndUpdate(doc.id, doc, {
        useFindAndModify: true,
        upsert: true,
        new: true,
      })
    );
  }
}
