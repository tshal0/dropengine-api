import {
  UseInterceptors,
  UseGuards,
  Controller,
  Inject,
  Get,
  Post,
  Delete,
  Body,
  Res,
  Param,
  Query,
  ConflictException,
  HttpStatus,
  UnauthorizedException,
  LoggerService,
  Logger,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { EntityNotFoundException } from "@shared/exceptions";
import { Request, Response as ExpressResponse } from "express";
import {
  DeleteSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
} from "../useCases/CRUD";
import { CreateSalesOrder } from "../useCases/CreateSalesOrder/CreateSalesOrder";
import { CreateOrderValidationPipe } from "./middleware";
import {
  CreateOrderApiDto,
  QueryOrdersDto,
  QueryOrdersResponseDto,
} from "./model";
import { User } from "@shared/decorators";
import { AuthenticatedUser } from "@shared/decorators/AuthenticatedUser";
import { SalesLoggingInterceptor } from "./middleware/SalesLoggingInterceptor";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CreateSalesOrderDto } from "@sales/useCases/CreateSalesOrder/CreateSalesOrderDto";

@UseGuards(AuthGuard())
@UseInterceptors(SalesLoggingInterceptor)
@Controller({ path: "orders", version: Versions.v1 })
export class OrdersController {
  private readonly logger: Logger = new Logger(OrdersController.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly create: CreateSalesOrder,
    private readonly load: GetSalesOrder,
    private readonly query: QuerySalesOrders,
    private readonly remove: DeleteSalesOrder
  ) {}

  @Get(":id")
  async getById(@Param("id") id: string) {
    this.logger.debug({
      message: `ORDERS REQUEST`,
      route: `/api/orders/${id}`,
      id,
    });
    let result = await this.load.execute(id);
    const aggregate = result;
    return aggregate.props();
  }
  @Get()
  async get(@Query() query: QueryOrdersDto) {
    let result = await this.query.execute(query);
    return new QueryOrdersResponseDto(query, result);
  }
  @Delete(":id")
  async delete(@Param("id") id: string) {
    let result = await this.remove.execute(id);
    return result;
  }
  @Post()
  async post(
    @Res() res: ExpressResponse,
    @User() user: AuthenticatedUser,
    @Body(CreateOrderValidationPipe) dto: CreateOrderApiDto
  ) {
    const useCaseDto = new CreateSalesOrderDto(dto, user);
    let order = await this.create.execute(useCaseDto);
    return res.status(HttpStatus.CREATED).json(order.props());
  }
}
