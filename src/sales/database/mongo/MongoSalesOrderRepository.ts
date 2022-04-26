import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseMongoRepository } from "@shared/mongo";
import { AzureTelemetryService } from "@shared/modules";
import { MongoSalesOrder, MongoSalesOrderDocument } from "./MongoSalesOrder";

@Injectable()
export class MongoOrdersRepository extends BaseMongoRepository<MongoSalesOrder> {
  constructor(
    @InjectModel(MongoSalesOrder.name)
    private readonly model: Model<MongoSalesOrderDocument>,
    private readonly logger: AzureTelemetryService
  ) {
    super(model);
  }
  async findById(id: string): Promise<MongoSalesOrder> {
    return await this._model.findById(id);
  }
  async update(doc: MongoSalesOrder): Promise<MongoSalesOrder> {
    return await this._model.findByIdAndUpdate(doc, {
      useFindAndModify: true,
      upsert: true,
      new: true,
    });
  }
}
