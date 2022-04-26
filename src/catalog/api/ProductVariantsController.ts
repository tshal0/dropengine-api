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
import { Result, ResultError } from "@shared/domain";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { VariantSKU } from "@catalog/domain";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { IProductVariantProps } from "@catalog/domain/interfaces";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";
import {
  QueryProductVariants,
} from "@catalog/useCases";
import { CreateProductVariant } from "@catalog/useCases/ProductVariant/CreateProductVariant";
import { DeleteProductVariant } from "@catalog/useCases/ProductVariant/DeleteProductVariant";
import { GetProductVariantBySku } from "@catalog/useCases/ProductVariant/GetProductVariantBySku";
import { GetProductVariantById } from "@catalog/useCases/ProductVariant/GetProductVariantByUuid";
import { Readable } from "stream";
import { VariantQueryTransformPipe } from "@catalog/middleware";
import { VariantQueryDto } from "@catalog/dto";
import { SyncVariant } from "@catalog/useCases/SyncVariant";

export class SyncVariantResponseDto {
  constructor(sku: string, result: Result<ProductVariant>) {
    this.sku = sku;
    if ([null, undefined, ""].includes(sku)) {
      this.message = `Failed to SyncVariant: '${sku}'. SKU was not defined.`;
    } else if (result?.isSuccess) {
      this.variant = result.value().props();
      this.message = `Synced variant '${sku}'.`;
    } else {
      this.error = result.error;
      this.message = `Failed to SyncVariant: '${sku}': ${result.error.message}`;
    }
  }
  sku: string;
  message: string;
  error: ResultError;
  variant: IProductVariantProps;
}

@Controller("/productVariants")
export class ProductVariantsController {
  constructor(
    private readonly logger: AzureTelemetryService,
    private readonly create: CreateProductVariant,
    private readonly getById: GetProductVariantById,
    private readonly getBySku: GetProductVariantBySku,
    private readonly remove: DeleteProductVariant,
    private readonly importCsv: ImportProductVariantCsv,
    private readonly query: QueryProductVariants,
    private readonly syncVariant: SyncVariant
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let result: Result<ProductVariant> = null;
    const skuResult = VariantSKU.from(id);

    const idValid = UUID.validate(id);
    let uuid = UUID.from(id);
    if (idValid) {
      result = await this.getById.execute(uuid.value());
    } else if (skuResult.isSuccess) {
      let sku = skuResult.value();
      result = await this.getBySku.execute(sku);
    }
    if (result.isSuccess) {
      return result.value().props(3);
    }
    throw new EntityNotFoundException(
      `ProductVariantNotFound`,
      id,
      result.error.message
    );
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

  @Post("sync")
  async postSync(@Query("sku") sku: string): Promise<any> {
    if (sku?.length) {
      let result = await this.syncVariant.execute({ sku });
      return new SyncVariantResponseDto(sku, result);
    }
    return new SyncVariantResponseDto(sku, null);
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
