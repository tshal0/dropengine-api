import { ProductService } from "@catalog/services";
import { Logger, NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { ProductArgs } from "./args/Product.args";
import { Product } from "./models";

const pubSub = new PubSub();

@Resolver((of) => Product)
export class ProductResolver {
  private readonly logger: Logger = new Logger(ProductResolver.name);
  constructor(private readonly service: ProductService) {}
  @Query((returns) => Product)
  async product(@Args() args: ProductArgs): Promise<Product> {
    if (args.id) return await this.service.findById(args.id);
    else if (args.sku) return await this.service.findBySku(args.sku);
    throw new NotFoundException(args.id || args.sku || args.slug);
  }
}
