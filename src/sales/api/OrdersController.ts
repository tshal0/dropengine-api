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
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { Request, Response as ExpressResponse } from "express";
import {
  DeleteSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
} from "../useCases/CRUD";
import { CreateOrderValidationPipe } from "./middleware";
import {
  CancelOrderApiDto,
  EditCustomerDto,
  EditPersonalizationDto,
  EditShippingAddressDto,
  QueryOrdersDto,
  QueryOrdersResponseDto,
} from "./model";
import { User } from "@shared/decorators";
import { AuthenticatedUser } from "@shared/decorators/AuthenticatedUser";
import { SalesLoggingInterceptor } from "./middleware/SalesLoggingInterceptor";
import { UpdatePersonalization } from "@sales/useCases/UpdatePersonalization";
import { UpdateShippingAddress } from "@sales/useCases";
import { UpdateCustomerInfo } from "@sales/useCases/UpdateCustomerInfo";
import { InjectModel } from "@nestjs/mongoose";
import {
  MongoSalesOrder,
  MongoSalesOrderDocument,
} from "@sales/database/mongo";
import { Model } from "mongoose";
import {
  CreateSalesOrderError,
  FailedToPlaceSalesOrderException,
} from "@sales/features/CreateSalesOrderError";
import { PlaceOrderRequest } from "@sales/features/PlaceOrderRequest";
import { PlaceOrder } from "@sales/features/PlaceOrder";

@UseGuards(AuthGuard())
@UseInterceptors(SalesLoggingInterceptor)
@Controller({ path: "sales/orders", version: Versions.v1 })
export class OrdersController {
  private readonly logger: Logger = new Logger(OrdersController.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly placeOrder: PlaceOrder,
    private readonly load: GetSalesOrder,
    private readonly query: QuerySalesOrders,
    private readonly remove: DeleteSalesOrder,
    private readonly updateCustomer: UpdateCustomerInfo,
    private readonly updateShipping: UpdateShippingAddress,
    private readonly updatePersonalization: UpdatePersonalization,
    @InjectModel(MongoSalesOrder.name)
    private readonly model: Model<MongoSalesOrderDocument>
  ) {}

  @Get(":id")
  async getById(@Param("id") id: string) {
    let result = await this.load.execute(id);
    const aggregate = result;
    return aggregate.raw();
  }
  // @Get(":id/events")
  // async getEvents(@Param("id") id: string) {
  //   let result = await this.loadEvents.execute(id);
  //   return result;
  // }
  @Get()
  async get(@Query() query: QueryOrdersDto) {
    let result = await this.query.execute(query);
    return new QueryOrdersResponseDto(query, result);
  }
  @Patch(":id/lineItems/:lineNumber/personalization")
  async patchPersonalization(
    @Param("id") id: string,
    @Param("lineNumber") lineNumber: number,
    @Body() dto: EditPersonalizationDto
  ) {
    let order = await this.updatePersonalization.execute({
      orderId: id,
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
    let order = await this.updateCustomer.execute({
      orderId: id,
      customer: dto.customer,
    });
    return order.raw();
  }
  @Patch(":id/shippingAddress")
  async patchShippingAddress(
    @Param("id") id: string,
    @Body() dto: EditShippingAddressDto
  ) {
    const order = await this.updateShipping.execute({
      orderId: id,
      shippingAddress: dto.shippingAddress,
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
    let result = await this.remove.execute(id);
    return result;
  }
  @Post()
  async post(
    @Res() res: ExpressResponse,
    @User() user: AuthenticatedUser,
    @Body(CreateOrderValidationPipe) request: PlaceOrderRequest
  ) {
    if (!user.canManageOrders(request.accountId)) {
      throw new FailedToPlaceSalesOrderException(
        request,
        `User '${user.email}' not authorized to place orders for given Account: '${request.accountId}'`,
        CreateSalesOrderError.UserNotAuthorizedForAccount
      );
    }
    let order = await this.placeOrder.execute(request);
    return res.status(HttpStatus.CREATED).json(order.raw());
  }
}
