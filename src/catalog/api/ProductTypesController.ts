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
import { IProductTypeProps } from "@catalog/model";

@Controller("catalog/productTypes")
export class ProductTypesController {
  private readonly logger: Logger = new Logger(ProductTypesController.name);

  constructor(private readonly service: ProductTypeService) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: number) {
    const result = await this.service.findById(id);
    return result.raw();
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: number) {
    return await this.service.delete(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async post(@Body() dto: CreateProductTypeDto): Promise<IProductTypeProps> {
    const result = await this.service.findAndUpdateOrCreate(dto);
    return result.raw();
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAll(): Promise<IProductTypeProps[]> {
    let types = await this.service.query();
    return types.map((t) => t.raw());
  }
}
