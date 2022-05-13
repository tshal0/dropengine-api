import {
  IMyEasySuiteLineItem,
  IMyEasySuiteOrder,
  IMyEasySuitePart,
  IMyEasySuiteShippingAddress,
  IMyEasySuiteStore,
} from "./IMyEasySuiteOrder";

export class MyEasySuiteOrder implements IMyEasySuiteOrder {
  gateway: string;
  order_id: string;
  order_date: Date;
  order_number: string;
  order_source: string;
  order_correlation_id: string;
  order_status: string;
  customer_name: string;
  customer_email: string;
  financial_status: string;
  fulfillment_status: string;
  tracking_number: string;
  tracking_company: string;
  tracking_url: string;
  order_updated_at: Date;
  store: IMyEasySuiteStore;
  shipping_address: IMyEasySuiteShippingAddress;
  billing_address: IMyEasySuiteShippingAddress;
  line_items: IMyEasySuiteLineItem[];
  parts: IMyEasySuitePart[];
  flags: any[];
  manufacturer: string;
  manufacturer_code: string;
  shipstation_order_id: string;
  shipstation_order_key: string;
  shipstation_order_status: string;
  label: any;
}
