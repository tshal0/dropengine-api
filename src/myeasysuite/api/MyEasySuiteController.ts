import {
  HandleOrderPlaced,
  HandleOrderPlacedDto,
} from "@myeasysuite/features/HandleOrderPlaced";
import {
  Controller,
  Get,
  Param,
  Body,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { MyEasySuiteClient } from "../myeasysuite.client";

@Controller({ path: "myeasysuite", version: Versions.v1 })
export class MyEasySuiteController {
  private readonly logger: Logger = new Logger(MyEasySuiteController.name);

  constructor(
    private readonly client: MyEasySuiteClient,
    private readonly handleOrderPlaced: HandleOrderPlaced
  ) {}

  @Post("/handleWebhook")
  async handle(@Body() dto: any) {
    this.logger.debug(dto);
  }
  @Post("/handleOrderPlaced")
  async postOrderPlaced(@Body() dto: HandleOrderPlacedDto) {
    this.logger.debug(dto);
    return await this.handleOrderPlaced.execute(dto);
  }
  @UseGuards(AuthGuard())
  @Get("/variants/:id")
  async getVariantBySku(@Param("sku") sku: string) {
    return await this.client.getVariantBySku(sku);
  }
  @UseGuards(AuthGuard())
  @Get("/orders/:id")
  async getOrderById(@Param("id") id: string) {
    return await this.client.getOrderById(id);
  }
}
