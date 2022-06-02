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
  @Post("/syncNames")
  async syncNames(@Body() dto: { orderNames: string[] }) {
    this.logger.debug(dto);
    for (let i = 0; i < dto.orderNames.length; i++) {
      const orderName = dto.orderNames[i];
      const orderDto = new HandleOrderPlacedDto();
      orderDto.orderId = orderName;
      try {
        await this.handleOrderPlaced.execute(orderDto);
      } catch (error) {
        this.logger.error(error);
      }
    }
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
