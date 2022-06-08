import { IProductionData } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "ProductionData" })
export class ProductionData implements IProductionData {
  @Field()
  route: string;
  @Field()
  material: string;
  @Field()
  thickness: string;
}
