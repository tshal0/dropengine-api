import { ImportProductVariantCsv } from "@catalog/useCases/ProductVariant/ImportProductVariantCsv";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
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
import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";
import {
  DeleteProduct,
  GetAllProducts,
  GetProduct,
  CreateProduct,
  QueryProductVariants,
} from "@catalog/useCases";
import { CreateProductVariant } from "@catalog/useCases/ProductVariant/CreateProductVariant";
import { DeleteProductVariant } from "@catalog/useCases/ProductVariant/DeleteProductVariant";
import { GetProductVariantBySku } from "@catalog/useCases/ProductVariant/GetProductVariantBySku";
import { GetProductVariantByUuid } from "@catalog/useCases/ProductVariant/GetProductVariantByUuid";
import { Readable } from "stream";
import { VariantQueryTransformPipe } from "@catalog/middleware";
import { VariantQueryDto } from "@catalog/dto";

@Controller("/productVariants")
export class ProductVariantsController {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly create: CreateProductVariant,
    private readonly getByUuid: GetProductVariantByUuid,
    private readonly getBySku: GetProductVariantBySku,
    private readonly remove: DeleteProductVariant,
    private readonly importCsv: ImportProductVariantCsv,
    private readonly query: QueryProductVariants
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
  @Get()
  @UseGuards(AuthGuard())
  @UsePipes(new VariantQueryTransformPipe())
  async getAll(@Query() query: VariantQueryDto) {
    let result = await this.query.execute(query);
    if (result.isSuccess) {
      return result.value().map((v) => v.props());
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
}
