export interface IAddShipmentDto {
  orderId: string;
  orderName: string;
  orderNumber: string;
  shipstationOrderId: string;
  shipstationOrderKey: string;
  shipmentId: string;
  shippedAt: Date;
  trackingNumber: string;
  carrierCode: string;
  serviceCode: string;
  packageCode: string;
  confirmation: string;
  warehouseId: number;
  shipmentCost: number;
  userId: string;
}
export class AddShipmentDto implements IAddShipmentDto {
  constructor(props?: IAddShipmentDto | undefined) {
    this.orderId = props?.orderId;
    this.orderName = props?.orderName;
    this.orderNumber = props?.orderNumber;
    this.shipstationOrderId = props?.shipstationOrderId;
    this.shipstationOrderKey = props?.shipstationOrderKey;
    this.shipmentId = props?.shipmentId;
    this.shippedAt = props?.shippedAt;
    this.trackingNumber = props?.trackingNumber;
    this.carrierCode = props?.carrierCode;
    this.serviceCode = props?.serviceCode;
    this.packageCode = props?.packageCode;
    this.confirmation = props?.confirmation;
    this.warehouseId = props?.warehouseId;
    this.shipmentCost = props?.shipmentCost;
    this.userId = props?.userId;
  }
  orderId: string;
  orderName: string;
  orderNumber: string;
  shipstationOrderId: string;
  shipstationOrderKey: string;
  shipmentId: string;
  shippedAt: Date;
  trackingNumber: string;
  carrierCode: string;
  serviceCode: string;
  packageCode: string;
  confirmation: string;
  warehouseId: number;
  shipmentCost: number;
  userId: string;
}
