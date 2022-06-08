import { VariantService } from "@catalog/services";
import { Logger, NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { VariantArgs } from "./args/Variant.args";
import { Variant } from "./models";

const pubSub = new PubSub();

@Resolver((of) => Variant)
export class VariantResolver {
  private readonly logger: Logger = new Logger(VariantResolver.name);
  constructor(private readonly service: VariantService) {}
  @Query((returns) => Variant)
  async variant(@Args() args: VariantArgs): Promise<Variant> {
    if (args.id) return await this.service.findById(args.id);
    else if (args.sku) return await this.service.findBySku(args.sku);
    throw new NotFoundException(args.id || args.sku || args.slug);
  }
}
