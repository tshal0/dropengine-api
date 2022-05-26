import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, QueryWithHelpers } from "mongoose";
import { MongoQueryParams, ResultSet } from "@shared/mongo";
import { MongoSalesOrder, MongoSalesOrderDocument } from "../schemas";
import { ISalesOrderProps, SalesOrder } from "@sales/domain";
export class SalesOrderQueryFilter {}
export class SalesOrderQueryResult {
  total: number;
  pages: number;
  size: number;
  page: number;
  data: SalesOrder[];
}
const options = {
  new: true,
};
@Injectable()
export class MongoOrdersRepository {
  private readonly logger: Logger = new Logger(MongoOrdersRepository.name);

  constructor(
    @InjectModel(MongoSalesOrder.name)
    private readonly model: Model<MongoSalesOrderDocument>
  ) {}

  async create(item: MongoSalesOrder): Promise<MongoSalesOrder> {
    let rawDoc = await this.model.create(item);
    return new MongoSalesOrder(rawDoc);
  }

  async insert(items: MongoSalesOrder[]): Promise<MongoSalesOrder[]> {
    let result = await this.model.create(items);
    return result.map((r) => new MongoSalesOrder(r));
  }

  async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    let result = await this.model.findByIdAndRemove(id);
    return result ? new MongoSalesOrder(result) : null;
  }

  async query(
    params: MongoQueryParams<MongoSalesOrder>
  ): Promise<SalesOrderQueryResult> {
    const { filter, skip, limit, sort, projection } = params;
    const size = params.limit || 25;
    const page = skip >= size ? skip / size : 0;
    const resp: SalesOrderQueryResult = {
      total: 0,
      pages: 0,
      size: size,
      page: page,
      data: [],
    };

    const countResult = await this.model.count(filter);
    const result = await this.model
      .find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection);

    resp.total = countResult;
    resp.pages = Math.floor(countResult / resp.size);

    resp.data = result.map((r) => new SalesOrder(r));

    return resp;
  }
  async findById(id: string): Promise<MongoSalesOrder> {
    let doc = await this.model.findById(id);
    return doc ? new MongoSalesOrder(doc) : null;
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
