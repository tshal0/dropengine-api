import { UUID } from "../valueObjects";
import { AggregateType } from "./AggregateType";
import moment from "moment";
import { UnprocessableEntityException } from "@nestjs/common";
import safeJsonStringify from "safe-json-stringify";

export class IDomainEvent {
  public readonly timestamp: Date;
  public readonly aggregateId: UUID;
  public readonly aggregateType: AggregateType;
  public readonly eventId: UUID;
  public readonly eventType: any;
  public readonly details: any;
}

export interface IDomainEventProps {
  readonly timestamp: Date;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly details: any;
}
export interface HasProps {
  props(): any;
}
export interface IDomainEvent extends HasProps {
  getEventId(): string;
  getEventType(): string;

  getAggregateId(): string;
  getAggregateType(): string;
  getTimestamp(): string;
  getDetails(): any;
  props(): IDomainEventProps;
}

export abstract class BaseDomainEvent implements IDomainEvent {
  public timestamp: Date;
  public aggregateId: UUID;
  public eventId: UUID;

  public abstract details: any;
  public abstract aggregateType: AggregateType;
  public abstract eventType: any;
  getEventId(): string {
    return this.eventId?.value();
  }
  getEventType(): string {
    try {
      return this.eventType.toString();
    } catch (error) {
      throw new UnprocessableEntityException(
        `Unable to call toString on event: ${this.aggregateType} ${
          this.eventId
        } ${safeJsonStringify(this.details)}`
      );
    }
  }
  getAggregateId(): string {
    return this.aggregateId?.value();
  }
  getAggregateType(): string {
    try {
      return this.aggregateType.toString();
    } catch (err) {
      throw new UnprocessableEntityException(
        `Unable to call toString on event: ${this.eventType}`
      );
    }
  }
  getDetails(): any {
    return { ...this.details };
  }
  getTimestamp(): string {
    return moment(this.timestamp).toISOString();
  }
  props(): IDomainEventProps {
    try {
      const aggId = this.getAggregateId();
      const aggType = this.getAggregateType();
      const details = this.getDetails();
      const evId = this.getEventId();
      const evType = this.getEventType();
      const ts = this.timestamp;
      const ev = {
        aggregateId: aggId,
        aggregateType: aggType,
        details: details,
        eventId: evId,
        eventType: evType,
        timestamp: ts,
      };
      return ev;
    } catch (err: any) {
      const error = new Error(err.message ?? err);
      throw error;
    }
  }
  public static generateUuid() {
    return UUID.generate();
  }
  new() {
    this.eventId = BaseDomainEvent.generateUuid();
    this.timestamp = moment().toDate();
    return this;
  }

  forAggregate(id: UUID) {
    this.aggregateId = id;
    return this;
  }

  fromDbEvent(dbEvent: IDomainEventProps) {
    this.eventId = UUID.from(dbEvent.eventId).value();
    this.eventType = dbEvent.eventType;
    this.aggregateId = UUID.from(dbEvent.aggregateId).value();
    this.timestamp = moment(dbEvent.timestamp).toDate();
    this.details = JSON.parse(dbEvent.details);
    return this;
  }
  toDbEvent(): IDomainEventProps {
    return {
      eventId: this.getEventId(),
      eventType: this.getEventType(),
      aggregateId: this.getAggregateId(),
      aggregateType: this.getAggregateType(),
      timestamp: this.timestamp,
      details: safeJsonStringify({ ...this.details }),
    };
  }
}
