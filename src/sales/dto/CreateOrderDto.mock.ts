import { CreateOrderApiDto } from "@sales/api";
import { CreateLineItemDto } from "@sales/dto";
import {
  mockCatalogVariant1,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
  mockAddress,
  mockCustomer,
  mockLineItem,
  mockUuid1,
} from "@sales/mocks";
import { spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import moment from "moment";
import { CreateOrderDto } from "./CreateOrderDto";

spyOnDate();
export const now = moment().toDate();
export const mockOrderName = "SLI-1000";
export const mockOrderNumber = "1000";
export const mockOrderId = "000000000000000000000001";
export const mockCreateOrderApiDtoLineItem1 = cloneDeep(mockLineItem);
export const mockCreateOrderApiDto: CreateOrderApiDto = {
  accountId: mockUuid1,
  orderName: mockOrderName,
  orderDate: now,
  orderNumber: mockOrderNumber,
  customer: cloneDeep(mockCustomer),
  lineItems: [mockCreateOrderApiDtoLineItem1],
  shippingAddress: cloneDeep(mockAddress),
  billingAddress: cloneDeep(mockAddress),
};
export const mockCreateLineItemDtoVariant1 = cloneDeep(mockCatalogVariant1);
export const mockCreateLineItemDto1: CreateLineItemDto = {
  lineNumber: 1,
  quantity: 1,
  variant: mockCreateLineItemDtoVariant1,
  properties: [
    { name: mockTopText, value: "ValidText" },
    { name: mockMiddleText, value: "ValidText" },
    { name: mockBottomText, value: "ValidText" },
    { name: mockInitial, value: "M" },
  ],
};
export const mockCreateOrderDtoLineItems: CreateLineItemDto[] = [
  cloneDeep(mockCreateLineItemDto1),
];
export const mockCreateOrderDto = cloneDeep(mockCreateOrderApiDto);
export const expectedCreateOrderDto: CreateOrderDto = new CreateOrderDto();

expectedCreateOrderDto.orderName = mockOrderName;
expectedCreateOrderDto.orderDate = now;
expectedCreateOrderDto.orderNumber = mockOrderNumber;
expectedCreateOrderDto.customer = mockCustomer;
expectedCreateOrderDto.shippingAddress = mockAddress;
expectedCreateOrderDto.billingAddress = mockAddress;
expectedCreateOrderDto.accountId = mockUuid1;
expectedCreateOrderDto.lineItems = [mockCreateLineItemDto1];
