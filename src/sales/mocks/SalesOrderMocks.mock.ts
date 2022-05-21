import { MESMetalArtMocks } from "@catalog/mocks";
import { MongoSalesOrder } from "@sales/database/mongo";
import { mockAddress, mockUuid1 } from "@sales/mocks";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { OrderPlacedDetails, SalesOrderPlaced } from "../domain/events/OrderPlaced";
import { ISalesLineItemProps } from "../domain/model/SalesLineItem";
import { ISalesOrderProps, OrderStatus, SalesOrder } from "../domain/model/SalesOrder";

export abstract class SalesOrderMocks {
  /** ORDER PLACED */
  static readonly accountId = mockUuid1;
  static readonly orderName = "SLI-1001";
  static readonly orderDate = now;
  static readonly orderNumber = 1001;
  static readonly customer = {
    email: "sample@mail.com",
    name: "Sample Customer",
  };
  static readonly shippingAddress = { ...mockAddress };
  static readonly billingAddress = { ...mockAddress };
  static readonly lineNumber1 = 1;
  static readonly quantity1 = 2;
  static readonly lineItem1Properties = [
    { name: "Top Text", value: "Sample" },
    { name: "Bottom Text", value: "Sample" },
  ];
  static readonly lineItem1 = {
    lineNumber: SalesOrderMocks.lineNumber1,
    quantity: SalesOrderMocks.quantity1,
    properties: SalesOrderMocks.lineItem1Properties,
    variant: cloneDeep(MESMetalArtMocks.expectedCatalogVariant),
  };

  static placedDetails: OrderPlacedDetails = {
    accountId: SalesOrderMocks.accountId,
    orderName: SalesOrderMocks.orderName,
    orderDate: SalesOrderMocks.orderDate,
    orderNumber: SalesOrderMocks.orderNumber,
    customer: SalesOrderMocks.customer,
    lineItems: [SalesOrderMocks.lineItem1],
    shippingAddress: SalesOrderMocks.shippingAddress,
    billingAddress: SalesOrderMocks.billingAddress,
  };
  static orderPlacedEvent: SalesOrderPlaced = new SalesOrderPlaced(
    null,
    cloneDeep(SalesOrderMocks.placedDetails)
  );

  static readonly id = "000000000000000000000001";

  static readonly salesLineItem1: ISalesLineItemProps = {
    lineNumber: SalesOrderMocks.lineNumber1,
    quantity: SalesOrderMocks.quantity1,
    variant: cloneDeep(MESMetalArtMocks.expectedCatalogVariant),
    personalization: cloneDeep(SalesOrderMocks.lineItem1Properties),
    flags: [],
  };

  /** ORDER CREATED */
  static orderProps: ISalesOrderProps = {
    id: SalesOrderMocks.id,
    accountId: SalesOrderMocks.accountId,
    orderName: SalesOrderMocks.orderName,
    orderNumber: SalesOrderMocks.orderNumber,
    orderDate: SalesOrderMocks.orderDate,
    orderStatus: OrderStatus.OPEN,
    lineItems: [SalesOrderMocks.salesLineItem1],
    customer: { ...SalesOrderMocks.customer },
    shippingAddress: { ...SalesOrderMocks.shippingAddress },
    billingAddress: { ...SalesOrderMocks.billingAddress },
    events: [],
    updatedAt: now,
    createdAt: now,
  };
  static order: SalesOrder = new SalesOrder(SalesOrderMocks.orderProps);
}
