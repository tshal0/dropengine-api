import { AggregateType, BaseDomainEvent, UUID } from "@shared/domain";

export const ProductTypeEventType = {
  Unknown: "Unknown",
  Created: "Created",
  Deleted: "Deleted",
  OptionsUpdated: "OptionsUpdated",
  ManufacturingDetailsChanged: "ManufacturingDetailsChanged",
  LivePreviewScriptChanged: "LivePreviewScriptChanged",
};

export class ProductTypeEvent extends BaseDomainEvent {
  public readonly aggregateType = AggregateType.ProductType;
  public eventType = ProductTypeEventType.Unknown;
  public details: any;
  
  public static generateUuid() {
    return UUID.generate();
  }
  public withDetails(details: any) {
    this.details = details;
    return this;
  }
}
