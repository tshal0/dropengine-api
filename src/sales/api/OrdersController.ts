import {
  UseInterceptors,
  UseGuards,
  Controller,
  Inject,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Res,
  Param,
  Query,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { Request, Response as ExpressResponse } from "express";
import { CreateOrderValidationPipe } from "./middleware";
import {
  CreateOrderDto,
  DeleteOrderResponseDto,
  OrderResponseDto,
  QueryOrdersDto,
  QueryOrdersResponseDto,
} from "./model";

@UseGuards(AuthGuard())
@Controller({ path: "orders", version: Versions.v1 })
export class OrdersController {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  @Get()
  async get(@Query() query: QueryOrdersDto) {
    return new QueryOrdersResponseDto(query);
  }
  @Get(":id")
  async getById(@Param("id") id: string) {
    return new OrderResponseDto(id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return new DeleteOrderResponseDto(id);
  }
  @Post()
  async post(
    @Res() res: ExpressResponse,
    @Body(CreateOrderValidationPipe) dto: CreateOrderDto
  ) {}
}
