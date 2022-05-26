import { Logger, NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ISalesOrderProps } from "@sales/domain";
import { SalesService } from "@sales/services";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
import { SalesOrdersArgs } from "./dto";
import { SalesOrder } from "./models";

const pubSub = new PubSub();

@Resolver((of) => SalesOrder)
export class SalesOrdersResolver {
  private readonly logger: Logger = new Logger(SalesOrdersResolver.name);

  constructor(private readonly service: SalesService) {}

  @Query((returns) => SalesOrder)
  async salesOrder(@Args("id") id: string): Promise<SalesOrder> {
    const salesOrder = await this.service.findById(id);
    if (!salesOrder) {
      throw new NotFoundException(id);
    }
    return salesOrder;
  }

  @Query((returns) => [SalesOrder])
  async salesOrders(@Args() args: SalesOrdersArgs): Promise<SalesOrder[]> {
    this.logger.debug(args);
    const filter: mongoose.FilterQuery<ISalesOrderProps> = {};
    if (args.orderName) filter.orderName = args.orderName;
    let result = await this.service.query({
      limit: args.take,
      skip: args.skip,
      filter: filter,
    });
    return result.data.map((d) => d.raw());
  }

  @Subscription((returns) => SalesOrder)
  salesOrderAdded() {
    return pubSub.asyncIterator("salesOrderAdded");
  }
}
