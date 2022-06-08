import { ProductTypeService } from "@catalog/services";
import { Logger, NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { ProductTypeArgs } from "./args/ProductType.args";
import { ProductType } from "./models";

const pubSub = new PubSub();

@Resolver((of) => ProductType)
export class ProductTypeResolver {
  private readonly logger: Logger = new Logger(ProductTypeResolver.name);
  constructor(private readonly service: ProductTypeService) {}
  @Query((returns) => ProductType)
  async productType(@Args() args: ProductTypeArgs): Promise<ProductType> {
    if (args.id) return await this.service.findById(args.id);
    else if (args.name) return await this.service.findByName(args.name);
    else if (args.slug) return await this.service.findBySlug(args.slug);
    throw new NotFoundException(args.id || args.name || args.slug);
  }
  @Query((returns) => ProductType)
  async bySlug(@Args("slug") slug: string): Promise<ProductType> {
    const entity = await this.service.findByName(slug);
    if (!entity) {
      throw new NotFoundException(slug);
    }
    return entity;
  }
  @Query((returns) => ProductType)
  async byName(@Args("name") name: string): Promise<ProductType> {
    const entity = await this.service.findByName(name);
    if (!entity) {
      throw new NotFoundException(name);
    }
    return entity;
  }
}
