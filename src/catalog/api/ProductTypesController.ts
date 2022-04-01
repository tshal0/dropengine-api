import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { UUID } from "@shared/domain";
import { AuthGuard } from "@nestjs/passport";
import { AzureLoggerService } from "@shared/modules";
import { IProductTypeProps } from "@catalog/domain";
import { CreateProductTypeDto } from "@catalog/dto";
import {
  DeleteProductType,
  GetAllProductTypes,
  GetProductType,
  CreateProductType,
  RenameProductType,
} from "@catalog/useCases";


@Controller("/api/productTypes")
export class ProductTypesController {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly find: GetAllProductTypes,
    private readonly getProductType: GetProductType,
    private readonly create: CreateProductType,
    private readonly rename: RenameProductType,
    private readonly remove: DeleteProductType
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.getProductType.execute(uuid.value());
    if (result.isSuccess) {
      return result.value().props();
    }
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.remove.execute(uuid.value());
    if (result.isSuccess) {
      return result.value();
    }
    return { message: result.error.message };
  }
  @Patch(":id/rename")
  async patch(
    @Param("id") id: string,
    @Body() dto: { name: string }
  ): Promise<IProductTypeProps> {
    let uuid = UUID.from(id);
    let result = await this.rename.execute({
      id: uuid.value(),
      name: dto.name,
    });
    if (result.isSuccess) {
      return result.value().props();
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
  @Post()
  async post(@Body() dto: CreateProductTypeDto): Promise<IProductTypeProps> {
    let result = await this.create.execute(dto);
    if (result.isSuccess) {
      return result.value().props();
    } else {
      //TODO: Handle conflicts, EntityAlreadyExists, etc.
      throw new UnprocessableEntityException(result.error);
    }
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAll(): Promise<IProductTypeProps[]> {
    let result = await this.find.execute();
    if (result.isSuccess) {
      return result.value();
    }
  }
}
