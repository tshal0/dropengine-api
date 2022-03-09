import { ImportProductVariantCsv } from "@catalog/useCases/ProductVariants/ImportProductVariantCsv";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Result } from "@shared/domain";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { VariantSKU } from "@catalog/domain";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { IProductVariantProps } from "@catalog/domain/interfaces";
import { IProductProps } from "@catalog/domain/interfaces/IProduct";
import { CreateProductDto } from "@catalog/dto/CreateProductDto";
import { CreateProductVariantDto } from "@catalog/dto/CreateProductVariantDto";
import {
  DeleteProduct,
  GetAllProducts,
  GetProduct,
  CreateProduct,
} from "@catalog/useCases";
import { CreateProductVariant } from "@catalog/useCases/ProductVariants/CreateProductVariant";
import { DeleteProductVariant } from "@catalog/useCases/ProductVariants/DeleteProductVariant";
import { GetProductVariantBySku } from "@catalog/useCases/ProductVariants/GetProductVariantBySku";
import { GetProductVariantByUuid } from "@catalog/useCases/ProductVariants/GetProductVariantByUuid";
import { Readable } from "stream";

@Controller("/api/productVariants")
export class ProductVariantsController {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly create: CreateProductVariant,
    private readonly getByUuid: GetProductVariantByUuid,
    private readonly getBySku: GetProductVariantBySku,
    private readonly remove: DeleteProductVariant,
    private readonly importCsv: ImportProductVariantCsv
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let result: Result<ProductVariant> = null;
    const skuResult = VariantSKU.from(id);
    if (skuResult.isSuccess) {
      let sku = skuResult.value();
      result = await this.getBySku.execute(sku);
    } else if (UUID.validate(id)) {
      let uuid = UUID.from(id);
      result = await this.getByUuid.execute(uuid.value());
    }
    if (result.isSuccess) {
      return result.value().props();
    }
    throw new EntityNotFoundException(`ProductVariantNotFound`, id);
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

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProductCsv(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    let csvArray: any[] = [];
    const stream = Readable.from(file.buffer.toString());
    let result = await this.importCsv.execute(stream);
    return result.isFailure ? result.error : result.value();
  }

  @Post()
  async post(
    @Body() dto: CreateProductVariantDto
  ): Promise<IProductVariantProps> {
    let result = await this.create.execute(dto);
    if (result.isSuccess) {
      return result.value().props();
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
  // @Get()
  // @UseGuards(AuthGuard())
  // async getAll(): Promise<IProductVariantProps[]> {
  //   let result = await this.find.execute();
  //   if (result.isSuccess) {
  //     return result.value();
  //   }
  // }
}
