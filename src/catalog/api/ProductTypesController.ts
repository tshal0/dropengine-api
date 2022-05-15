import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateProductTypeDto } from "@catalog/dto";
import { ProductTypeService } from "@catalog/services/ProductTypeService";
import { IProductTypeProps } from "@catalog/domain/model";

@Controller("catalog/productTypes")
export class ProductTypesController {
  private readonly logger: Logger = new Logger(ProductTypesController.name);

  constructor(private readonly service: ProductTypeService) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    return await this.service.findById(id);
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    return await this.service.delete(id);
  }
  // @Patch(":id/rename")
  // async patch(
  //   @Param("id") id: string,
  //   @Body() dto: { name: string }
  // ): Promise<IProductTypeProps> {
  //   let uuid = UUID.from(id);
  //   let result = await this.rename.execute({
  //     id: uuid.value(),
  //     name: dto.name,
  //   });
  //   if (result.isSuccess) {
  //     return result.value().props();
  //   } else {
  //     throw new UnprocessableEntityException(result.error);
  //   }
  // }
  @Post()
  async post(@Body() dto: CreateProductTypeDto): Promise<IProductTypeProps> {
    return await this.service.create(dto);
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAll(): Promise<IProductTypeProps[]> {
    return await this.service.query();
  }
}
