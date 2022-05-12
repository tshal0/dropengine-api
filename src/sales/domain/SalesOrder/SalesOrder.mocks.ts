import { MongoSalesLineItem } from "@sales/database/mongo/MongoSalesLineItem";
import mongoose, { Types } from "mongoose";
import {
  mockUuid1,
  mockCustomer,
  mockLineItem,
  mockCatalogVariant1,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
} from "@sales/mocks";
import {
  mockCreateLineItemDtoVariant1,
  mockCreateOrderDto,
  mockCreateOrderDtoLineItems,
  mockOrderId,
  now,
} from "@sales/dto/CreateOrderDto.mock";
import { MongoSalesOrder } from "@sales/database/mongo/MongoSalesOrder";
import { CreateOrderDto } from "@sales/dto/CreateOrderDto";
const oid = new Types.ObjectId(mockOrderId);
const lineItemId = "000000000000000000000002";
const lid = new Types.ObjectId(lineItemId);
export const mockMongoSalesLineItem: MongoSalesLineItem =
  new MongoSalesLineItem();
mockMongoSalesLineItem._id = lid;
mockMongoSalesLineItem.id = lineItemId;
mockMongoSalesLineItem.lineNumber = 1;
mockMongoSalesLineItem.quantity = mockLineItem.quantity;
mockMongoSalesLineItem.variant = mockCreateLineItemDtoVariant1;
mockMongoSalesLineItem.personalization = [
  { name: mockTopText, value: "ValidText" },
  { name: mockMiddleText, value: "ValidText" },
  { name: mockBottomText, value: "ValidText" },
  { name: mockInitial, value: "M" },
];
mockMongoSalesLineItem.flags = [];
mockMongoSalesLineItem.updatedAt = now;
mockMongoSalesLineItem.createdAt = now;

const cdto: CreateOrderDto = new CreateOrderDto();
cdto.accountId = mockCreateOrderDto.accountId;
cdto.billingAddress = mockCreateOrderDto.billingAddress;
cdto.shippingAddress = mockCreateOrderDto.shippingAddress;
cdto.customer = mockCreateOrderDto.customer;
cdto.orderDate = mockCreateOrderDto.orderDate;
cdto.orderName = mockCreateOrderDto.orderName;
cdto.orderNumber = mockCreateOrderDto.orderNumber;
cdto.lineItems = mockCreateOrderDtoLineItems;

export const mockMongoSalesOrder: MongoSalesOrder = {
  _id: oid,
  id: mockOrderId,
  accountId: mockUuid1,
  orderStatus: "OPEN",
  orderDate: cdto.orderDate,
  orderNumber: +cdto.orderNumber,
  lineItems: [mockMongoSalesLineItem],
  customer: cdto.customer,
  shippingAddress: cdto.shippingAddress,
  billingAddress: cdto.billingAddress,
  updatedAt: undefined,
  createdAt: undefined,
};
