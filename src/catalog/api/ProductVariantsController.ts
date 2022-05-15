import { IVariantProps } from "@catalog/domain";
import { CreateVariantDto, VariantQueryDto } from "@catalog/dto";
import { VariantQueryTransformPipe } from "@catalog/middleware";
import { VariantService } from "@catalog/services/VariantService";
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotImplementedException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";

// export class SyncVariantResponseDto {
//   constructor(sku: string, result: Result<ProductVariant>) {
//     this.sku = sku;
//     if ([null, undefined, ""].includes(sku)) {
//       this.message = `Failed to SyncVariant: '${sku}'. SKU was not defined.`;
//     } else if (result?.isSuccess) {
//       this.variant = result.value().props();
//       this.message = `Synced variant '${sku}'.`;
//     } else {
//       this.error = result.error;
//       this.message = `Failed to SyncVariant: '${sku}': ${result.error.message}`;
//     }
//   }
//   sku: string;
//   message: string;
//   error: ResultError;
//   variant: IProductVariantProps;
// }

@Controller("catalog/productVariants")
export class ProductVariantsController {
  private readonly logger: Logger = new Logger(ProductVariantsController.name);

  constructor(private service: VariantService) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    const result = await this.service.findById(id);
    return result.raw();
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    return await this.service.delete(id);
  }

  // @Post("sync")
  // async postSync(@Query("sku") sku: string): Promise<any> {
  //   if (sku?.length) {
  //     let result = await this.syncVariant.execute({ sku });
  //     return new SyncVariantResponseDto(sku, result);
  //   }
  //   return new SyncVariantResponseDto(sku, null);
  // }

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProductCsv(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    throw new NotImplementedException();
  }

  @Post()
  async post(@Body() dto: CreateVariantDto): Promise<IVariantProps> {
    const result = await this.service.create(dto);
    return result.raw();
  }
  @Get()
  @UseGuards(AuthGuard())
  @UsePipes(new VariantQueryTransformPipe())
  async getAll(@Query() query: VariantQueryDto) {
    const result = await this.service.query();
    return result.map((r) => r.raw());
  }
}
