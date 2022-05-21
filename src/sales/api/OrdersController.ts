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
  HttpStatus,
  Logger,
  Patch,
  NotImplementedException,
  HttpCode,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { Request, Response as ExpressResponse } from "express";
import { CreateOrderValidationPipe } from "./middleware";
import {
  CancelOrderApiDto,
  EditCustomerDto,
  EditPersonalizationDto,
  EditShippingAddressDto,
  OrderResponse,
  QueryOrdersDto,
  QueryOrdersResponseDto,
} from "./model";
import { User } from "@shared/decorators";
import { AuthenticatedUser } from "@shared/decorators/AuthenticatedUser";
import { SalesLoggingInterceptor } from "./middleware/SalesLoggingInterceptor";
import { SalesService } from "@sales/services";
import {
  PlaceOrder,
  PlaceOrderRequest,
  FailedToPlaceSalesOrderException,
  PlaceOrderError,
} from "@sales/features/PlaceOrder";
import {
  ChangeCustomerInfo,
  ChangePersonalization,
  ChangeShippingAddress,
} from "@sales/features";

@UseGuards(AuthGuard())
@UseInterceptors(SalesLoggingInterceptor)
@Controller({ path: "sales/orders", version: Versions.v1 })
export class OrdersController {
  private readonly logger: Logger = new Logger(OrdersController.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly placeOrder: PlaceOrder,
    private readonly changeCustomer: ChangeCustomerInfo,
    private readonly changeShipping: ChangeShippingAddress,
    private readonly changePersonalization: ChangePersonalization,
    private readonly sales: SalesService
  ) {}

  @Get(":id")
  async getById(@Param("id") id: string) {
    let result = await this.sales.findById(id);
    return new OrderResponse(result);
  }
  // @Get(":id/events")
  // async getEvents(@Param("id") id: string) {
  //   let result = await this.loadEvents.execute(id);
  //   return result;
  // }
  @Get()
  async get(@Query() query: QueryOrdersDto) {
    const { page, size } = query;
    let result = await this.sales.query({
      skip: page || 0,
      limit: size || 10,
      filter: null,
      projection: null,
      sort: { orderDate: -1 },
    });
    return new QueryOrdersResponseDto(result);
  }
  @Patch(":id/lineItems/:lineNumber/personalization")
  async patchPersonalization(
    @Param("id") id: string,
    @Param("lineNumber") lineNumber: number,
    @Body() dto: EditPersonalizationDto
  ) {
    let order = await this.changePersonalization.execute({
      id,
      lineNumber,
      personalization: dto.personalization,
    });
    return order.raw();
  }
  @Patch(":id/customer")
  async patchCustomer(
    @Param("id") id: string,
    @Body() dto: { customer: EditCustomerDto }
  ) {
    let order = await this.changeCustomer.execute({
      id,
      customer: dto.customer,
    });
    return order.raw();
  }
  @Patch(":id/shippingAddress")
  async patchShippingAddress(
    @Param("id") id: string,
    @Body() dto: EditShippingAddressDto
  ) {
    const order = await this.changeShipping.execute({
      id,
      address: dto.shippingAddress,
    });
    return order.raw();
  }
  @Post(":id/send")
  async postSend(@Param("id") id: string, @Body() dto: any) {
    throw new NotImplementedException({ dto, id });
  }
  @Post(":id/recall")
  async postRecall(@Param("id") id: string, @Body() dto: CancelOrderApiDto) {
    throw new NotImplementedException({ dto, id });
  }
  @Post(":id/cancel")
  async postCancel(
    @Param("id") id: string,
    @Body() dto: EditPersonalizationDto
  ) {
    throw new NotImplementedException({ dto, id });
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    let result = await this.sales.delete(id);
    return result;
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async post(
    @User() user: AuthenticatedUser,
    @Body(CreateOrderValidationPipe) request: PlaceOrderRequest
  ) {
    if (!user.canManageOrders(request.accountId)) {
      throw new FailedToPlaceSalesOrderException(
        request,
        `User '${user.email}' not authorized to place orders for given Account: '${request.accountId}'`,
        PlaceOrderError.UserNotAuthorizedForAccount
      );
    }
    let order = await this.placeOrder.execute(request);
    return new OrderResponse(order);
  }
}
