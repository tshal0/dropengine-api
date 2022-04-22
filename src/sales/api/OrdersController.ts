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

@UseGuards(AuthGuard())
@UseInterceptors(SalesLoggingInterceptor)
@Controller({ path: "orders", version: Versions.v1 })
export class OrdersController {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly create: CreateSalesOrder,
    private readonly load: GetSalesOrder,
    private readonly query: QuerySalesOrders,
    private readonly remove: DeleteSalesOrder
  ) {}

  @Get(":id")
  async getById(@Param("id") id: string) {
    let result = await this.load.execute(id);
    if (result.isFailure) {
      throw new EntityNotFoundException(
        `GetSalesOrderFailed`,
        id,
        result.error.message
      );
    }
    const aggregate = result.value();
    return aggregate.props();
  }
  @Get()
  async get(@Query() query: QueryOrdersDto) {
    let result = await this.query.execute(query);
    if (result.isFailure) {
      throw new ConflictException(result.error, `QuerySalesOrdersFailed`);
    }
    const orders = result.value();
    return new QueryOrdersResponseDto(query, orders);
  }
  @Delete(":id")
  async delete(@Param("id") id: string) {
    let result = await this.remove.execute(id);
    if (result.isFailure) {
      throw new ConflictException(result.error, `DeleteSalesOrderFailed`);
    }
    return result.value();
  }
  @Post()
  async post(
    @Res() res: ExpressResponse,
    @User() user: AuthenticatedUser,
    @Body(CreateOrderValidationPipe) dto: CreateOrderApiDto
  ) {
    //TODO: Extract User validation into middleware?

    if (user.canManageOrders(dto.accountId)) {
      let result = await this.create.execute(dto);
      if (result.isFailure) {
        throw new ConflictException(result.error, `CreateSalesOrderFailed`);
      }
      const order = result.value();
      return res.status(HttpStatus.CREATED).send(order.props());
    } else throw new UnauthorizedException(`UserPermissionsNotFound`);
  }
}
