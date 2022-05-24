import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";
import "multer";
import { ProductResponseDto } from "@catalog/dto/Product/ProductResponseDto";
import { QueryProductResponseDto } from "@catalog/dto/Product/QueryProductResponseDto";
import { ProductService } from "@catalog/services/ProductService";
import { IProductProps } from "@catalog/model";

export class ProductsQueryDto {
  page: number;
  size: number;
  productTypeId: string;
}

@Controller("catalog/products")
export class ProductsController {
  private readonly logger: Logger = new Logger(ProductsController.name);

  constructor(private readonly service: ProductService) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    const result = await this.service.findById(id);
    return result.raw();
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
    let products = await this.service.query();
    if (products) {
      let data = products.map((prop) => ProductResponseDto.from(prop.raw()));
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
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    return await this.service.delete(id);
  }

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProductCsv(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    const stream = file.buffer.toString();
    let result = await this.service.import(stream);
    const imported = result.map((r) => ProductResponseDto.from(r.raw()));
    return { imported };
  }
  @Post()
  async post(@Body() dto: CreateProductDto): Promise<IProductProps> {
    const result = await this.service.findAndUpdateOrCreate(dto);
    return result.raw();
  }
}
