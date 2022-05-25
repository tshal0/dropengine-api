import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "recipe " })
export class Recipe {
  constructor(props?: Recipe | undefined) {
    if (props) {
      this.id = props.id;
      this.title = props.title;
      this.description = props.description;
      this.creationDate = props.creationDate;
      this.ingredients = props.ingredients;
    }
  }
  @Field((type) => ID)
  id: string;

  @Directive("@upper")
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];
}
