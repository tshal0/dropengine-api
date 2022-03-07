import {
  AggregateType,
  BaseDomainEvent,
  IDomainEventProps,
  UUID,
} from "@shared/domain";
import moment from "moment";

export const ProductEventType = {
  Unknown: "Unknown",
  Activated: "Activated",
  Deactivated: "Deactivated",
  Deleted: "Deleted",
};

export class ProductEvent extends BaseDomainEvent {
  public readonly aggregateType = AggregateType.Product;
  public eventType = ProductEventType.Unknown;
  public details: any;
  
  public static generateUuid() {
    return UUID.generate();
  }
  public withDetails(details: any) {
    this.details = details;
    return this;
  }
}
