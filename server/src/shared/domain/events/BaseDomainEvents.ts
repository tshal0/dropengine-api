import { UUID } from '../ValueObjects';
import { AggregateType } from './AggregateType';
import * as moment from 'moment';
import { UnprocessableEntityException } from '@nestjs/common';

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
  getProps(): any;
}
export interface IDomainEvent extends HasProps {
  getEventId(): string;
  getEventType(): string;

  getAggregateId(): string;
  getAggregateType(): string;
  getTimestamp(): string;
  getDetails(): any;
  getProps(): IDomainEventProps;
}

export abstract class BaseDomainEvent implements IDomainEvent {
  public timestamp: Date;
  public aggregateId: UUID;
  public eventId: UUID;

  public abstract details: any;
  public abstract aggregateType: AggregateType;
  public abstract eventType: any;
  getEventId(): string {
    return this.eventId.value;
  }
  getEventType(): string {
    try {
      return this.eventType.toString();
    } catch (error) {
      throw new UnprocessableEntityException(
        `Unable to call toString on event: ${this.aggregateType} ${
          this.eventId
        } ${JSON.stringify(this.details)}`,
      );
    }
  }
  getAggregateId(): string {
    return this.aggregateId.value;
  }
  getAggregateType(): string {
    try {
      return this.aggregateType.toString();
    } catch (err) {
      throw new UnprocessableEntityException(
        `Unable to call toString on event: ${this.eventType}`,
      );
    }
  }
  getDetails(): any {
    return { ...this.details };
  }
  getTimestamp(): string {
    return moment(this.timestamp).toISOString();
  }
  getProps(): IDomainEventProps {
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
      console.log(JSON.stringify(error));
      throw error;
    }
  }

  new() {
    this.eventId = UUID.generate();
    this.timestamp = moment().toDate();
    return this;
  }

  forAggregate(id: UUID) {
    this.aggregateId = id;
    return this;
  }

  abstract fromDbEvent(dbEvent: IDomainEventProps);
}
