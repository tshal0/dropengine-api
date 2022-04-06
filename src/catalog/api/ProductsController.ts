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
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { IProductProps } from "@catalog/domain/interfaces/IProduct";
import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";
import {
  DeleteProduct,
  GetAllProducts,
  GetProduct,
  CreateProduct,
  ImportProductCsv,
} from "@catalog/useCases";
import "multer";
import { AzureStorageService } from "@shared/modules";
import csv from "csvtojson";
import { Readable } from "stream";
import { ProductResponseDto } from "@catalog/dto/Product/ProductResponseDto";
import { QueryProductResponseDto } from "@catalog/dto/Product/QueryProductResponseDto";

export class ProductsQueryDto {
  page: number;
  size: number;
  productTypeId: string;
}

@Controller("/products")
export class ProductsController {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly storage: AzureStorageService,
    private readonly find: GetAllProducts,
    private readonly getProduct: GetProduct,
    private readonly create: CreateProduct,
    private readonly remove: DeleteProduct,
    private readonly importCsv: ImportProductCsv
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.getProduct.execute(uuid.value());
    if (result.isFailure)
      throw new EntityNotFoundException(`Product Not Found: '${id}'`, id);
    let product = result.value();
    const props = product.props();
    return props;
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
    if (result.isSuccess) {
      return result.value();
    }
    throw new UnprocessableEntityException(result.error);
  }
  @Post()
  async post(@Body() dto: CreateProductDto): Promise<IProductProps> {
    let result = await this.create.execute(dto);
    if (result.isFailure) throw new UnprocessableEntityException(result.error);
    const product = result.value();
    const entity = product.props();
    return entity;
  }
  @Get()
  @UseGuards(AuthGuard())
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  async getAll(
    @Query() query: ProductsQueryDto
  ): Promise<QueryProductResponseDto> {
    this.logger.debug(`[ProductsController]`, { query });
    let result = await this.find.execute(query);
    if (result.isSuccess) {
      let props = result.value();
      let data = props.map((prop) => ProductResponseDto.from(prop));
      let resp = new QueryProductResponseDto();
      resp.data = data;
      resp.page = 0;
      resp.pages = 1;
      resp.query = "";
      resp.size = data.length;
      resp.total = data.length;
      return resp;
    }
  }
}
