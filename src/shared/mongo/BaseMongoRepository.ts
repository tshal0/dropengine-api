import { aqp } from "@shared/utils";
import { IsNumberString } from "class-validator";
import * as mongoose from "mongoose";
export interface ResultSet<T> {
  count: number;
  result: T[];
}

export class MongoQueryParams {
  @IsNumberString()
  skip?: number;
  @IsNumberString()
  limit?: number;
  filter?: any;
  sort?: any;
  projection?: any;
}

export interface IWrite<T> {
  create: (item: T) => Promise<T>;
  delete: (_id: string) => void;
}

export interface IRead<T> {
  all: () => Promise<T[]>;
}

export class BaseMongoRepository<T> implements IRead<T>, IWrite<T> {
  protected _model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this._model = model;
  }

  async exists(filter: mongoose.FilterQuery<T>): Promise<boolean> {
    const resp = await this._model.exists(filter);
    return resp != null;
  }

  async create(item: T): Promise<T> {
    return await (await this._model.create(item)).toObject();
  }

  async insert(items: T[]): Promise<T[]> {
    return await (await this._model.create(items)).map((doc) => doc.toObject());
  }

  async all(): Promise<T[]> {
    return await this._model.find({});
  }

  async delete(_id: string) {
    return await this._model.findByIdAndRemove(_id);
  }

  async find(params: MongoQueryParams): Promise<ResultSet<T>> {
    const resp: ResultSet<T> = {
      count: 0,
      result: [],
    };
    const { filter, skip, limit, sort, projection } = params;
    const countResult = await this._model.count(filter);
    const result = await this._model
      .find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection);

    resp.count = countResult;
    resp.result = result;

    return resp;
  }
}
export const convertUrlToMongoQuery = (url: string): MongoQueryParams => {
  let query = url.split("?")[1];
  const params: MongoQueryParams = aqp(query);
  return params;
};
