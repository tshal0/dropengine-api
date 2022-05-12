import { now } from "@shared/mocks";
import { CreateOrderDto } from "@sales/dto";
import { SalesOrder } from "@sales/domain";
import {
  mockCatalogVariant1,
  mockCustomer,
  mockOrderName1,
  mockOrderNumber1,
  mockUuid1,
  mockAddress,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
  mockLineItem,
} from "@sales/mocks";
import { cloneDeep } from "lodash";
import { AuthenticatedUser } from "@shared/decorators";
import { CreateSalesOrderDto } from "@sales/dto/CreateSalesOrderDto";

export function newMockCreateSalesOrderDto() {
  const mockAccountId = mockUuid1;
  const mockShipping = cloneDeep(mockAddress);
  const mockBilling = cloneDeep(mockAddress);
  const mockLi1 = cloneDeep(mockLineItem);
  mockLi1.sku = mockCatalogVariant1.sku;
  mockLi1.lineItemProperties = [
    { name: mockTopText, value: "ValidText" },
    { name: mockMiddleText, value: "ValidText" },
    { name: mockBottomText, value: "ValidText" },
    { name: mockInitial, value: "M" },
  ];

  const mockDto: CreateSalesOrderDto = new CreateSalesOrderDto();
  mockDto.accountId = mockAccountId;
  mockDto.orderName = mockOrderName1;
  mockDto.orderDate = now;
  mockDto.orderNumber = mockOrderNumber1;
  mockDto.customer = mockCustomer;
  mockDto.lineItems = [mockLi1];
  mockDto.shippingAddress = mockShipping;
  mockDto.billingAddress = mockBilling;
  return mockDto;
}
