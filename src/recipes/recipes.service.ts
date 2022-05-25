import { Injectable } from "@nestjs/common";
import moment from "moment";
import { NewRecipeInput } from "./dto/new-recipe.input";
import { RecipesArgs } from "./dto/recipes.args";
import { Recipe } from "./models/recipe.model";

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: NewRecipeInput): Promise<Recipe> {
    return {} as any;
  }

  async findOneById(id: string): Promise<Recipe> {
    return new Recipe({
      id,
      creationDate: moment().toDate(),
      ingredients: ["Tomato"],
      title: "Title",
      description: "Description",
    });
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    const first = new Recipe({
      id: "1001",
      creationDate: moment().toDate(),
      ingredients: ["Tomato"],
      title: "Title",
      description: "Description",
    });
    const second = new Recipe({
      id: "1002",
      creationDate: moment().toDate(),
      ingredients: ["Cheese"],
      title: "Title 2",
      description: "Description 2",
    });
    return [first, second] as Recipe[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
