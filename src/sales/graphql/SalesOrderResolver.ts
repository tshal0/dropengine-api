import { Logger, NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ISalesOrderProps } from "@sales/domain";
import { SalesService } from "@sales/services";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import { SalesOrdersQueryArgs } from "./dto";
import { PaginatedSalesOrders } from "./dto/PaginatedSalesOrders";
import { SalesOrderOptionsQueryArgs } from "./dto/SalesOrderOptionsQueryArgs";
import { SalesOrderQuery } from "./dto/SalesOrderQuery";
import { SalesOrderQueryOptions } from "./dto/SalesOrderQueryOptions";
import { SalesOrder } from "./models";

const pubSub = new PubSub();

@Resolver((of) => SalesOrder)
export class SalesOrderResolver {
  private readonly logger: Logger = new Logger(SalesOrderResolver.name);

  constructor(private readonly service: SalesService) {}

  @Query((returns) => SalesOrder)
  async salesOrder(@Args("id") id: string): Promise<SalesOrder> {
    const salesOrder = await this.service.findById(id);
    if (!salesOrder) {
      throw new NotFoundException(id);
    }
    return salesOrder;
  }
  @Query((returns) => SalesOrderQueryOptions)
  async salesOrderOptions(
    @Args() args: SalesOrderOptionsQueryArgs
  ): Promise<SalesOrderQueryOptions> {
    this.logger.debug(args);
    const filter: mongoose.FilterQuery<ISalesOrderProps> =
      SalesOrderQuery.parse(args.query);

    filter.orderDate = { $gte: args.startDate, $lte: args.endDate };
    const params = {
      filter,
    };
    let result = await this.service.options(params);
    const query = safeJsonStringify(filter);
    this.logger.debug(`[salesOrderOptions] query: ${query}`);
    return new SalesOrderQueryOptions(result);
  }
  @Query((returns) => PaginatedSalesOrders)
  async salesOrders(
    @Args() args: SalesOrdersQueryArgs
  ): Promise<PaginatedSalesOrders> {
    this.logger.debug(args);
    const filter: mongoose.FilterQuery<ISalesOrderProps> =
      SalesOrderQuery.parse(args.query);

    filter.orderDate = { $gte: args.startDate, $lte: args.endDate };
    const sort = {};
    sort[args.sortBy] = args.sortDir;
    const skip = args.page * args.size;
    const limit = args.size;
    const params = {
      limit,
      sort,
      skip,
      filter,
    };
    let result = await this.service.query(params);

    let orders = result.data.map((d) => d.raw());

    const query = safeJsonStringify(filter);

    return new PaginatedSalesOrders({
      count: result.total,
      page: result.page,
      pages: result.pages,
      size: result.size,
      query: query,
      data: orders,
    });
  }

  @Subscription((returns) => SalesOrder)
  salesOrderAdded() {
    return pubSub.asyncIterator("salesOrderAdded");
  }
}
