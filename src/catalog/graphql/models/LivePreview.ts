import { ILivePreview } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "LivePreview" })
export class LivePreview implements ILivePreview {
  @Field()
  link: string;
  @Field()
  name: string;
  @Field()
  enabled: boolean;
  @Field()
  version: string;
}
