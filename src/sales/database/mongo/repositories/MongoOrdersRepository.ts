import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, QueryWithHelpers } from "mongoose";
import { MongoQueryParams, ResultSet } from "@shared/mongo";
import { MongoSalesOrder, MongoSalesOrderDocument } from "../schemas";

const options = {
  new: true,
};
@Injectable()
export class MongoOrdersRepository {
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
  ) {}

  async exists(
    filter: mongoose.FilterQuery<MongoSalesOrderDocument>
  ): Promise<boolean> {
    const resp = await this.model.exists(filter);
    return resp != null;
  }

  async create(item: MongoSalesOrder): Promise<MongoSalesOrder> {
    let rawDoc = await this.model.create(item);
    let doc = new MongoSalesOrder(rawDoc);
    return doc;
  }

  async insert(items: MongoSalesOrder[]): Promise<MongoSalesOrder[]> {
    return await this.model.create(items);
  }

  async all(): Promise<MongoSalesOrder[]> {
    return await this.model.find({});
  }

  async delete(_id: string) {
    return await this.model.findByIdAndRemove(_id);
  }

  async find(params: MongoQueryParams): Promise<ResultSet<MongoSalesOrder>> {
    const resp: ResultSet<MongoSalesOrder> = {
      count: 0,
      result: [],
    };
    const { filter, skip, limit, sort, projection } = params;
    const countResult = await this.model.count(filter);
    const result = await this.model
      .find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection);

    resp.count = countResult;
    resp.result = result;

    return resp;
  }
  async findById(id: string): Promise<MongoSalesOrder> {
    return await this.handle<QueryWithHelpers<any, any>>(() =>
      this.model.findById(id)
    );
  }

  // async findByIdAndUpdateOrCreate(
  //   doc: MongoSalesOrder
  // ): Promise<MongoSalesOrder> {
  //   return await this.handle(() =>
  //     doc.id
  //       ? this.model
  //           .findByIdAndUpdate(doc.id, doc, options)
  //           .then((d) => d.toObject())
  //       : this.model.create<MongoSalesOrder>(doc).then((d) => d.toObject())
  //   );
  // }
}
