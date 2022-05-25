import { IProductionData } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "productionData " })
export class GProductionData implements IProductionData {
  @Field()
  route: string;
  @Field()
  material: string;
  @Field()
  thickness: string;
}
