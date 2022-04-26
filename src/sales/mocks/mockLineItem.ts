import { CreateOrderLineItemApiDto } from "@sales/api";
import { mockSku1 } from "./mocks";

export const mockLineItem: CreateOrderLineItemApiDto = {
  sku: mockSku1,
  quantity: 1,
  lineItemProperties: [{ name: "Name", value: "MockName" }],
};
