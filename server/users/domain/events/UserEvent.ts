import { AggregateType } from '@shared/domain/events/AggregateType';
import {
  BaseDomainEvent,
  IDomainEventProps,
} from '@shared/domain/events/BaseDomainEvents';
import { UUID } from '@shared/domain/ValueObjects';
import { DbUserEvent } from '@shared/modules/prisma/models/User';
import * as moment from 'moment';
import { CreateUserDto } from '../../dto/CreateUserDto';
export const UserEventType = {
  Unknown: 'Unknown',
  UserSignedUp: 'UserSignedUp',
  Activated: 'Activated',
  Deactivated: 'Deactivated',
  Deleted: 'Deleted',
};
export class UserEvent extends BaseDomainEvent {
  public readonly aggregateType = AggregateType.User;
  public eventType = UserEventType.Unknown;
  public details: any;
  fromDbEvent(dbEvent: DbUserEvent) {
    this.eventId = UUID.from(dbEvent.eventId);
    this.eventType = UserEventType[dbEvent.eventType];
    this.aggregateId = UUID.from(dbEvent.aggregateId);
    this.timestamp = moment(dbEvent.timestamp).toDate();
    this.details = JSON.parse(dbEvent.details);
    return this;
  }
  toDbEvent(): DbUserEvent {
    return {
      eventId: this.getEventId(),
      eventType: this.getEventType(),
      aggregateId: undefined,
      aggregateType: 'User',
      timestamp: this.timestamp,
      details: JSON.stringify({ ...this.details }),
    };
  }
  public static generateUuid() {
    return UUID.generate();
  }
}
export class UserSignedUp extends UserEvent {
  public readonly eventType = UserEventType.UserSignedUp;
  public details: CreateUserDto = {
    email: '',
    firstName: '',
    lastName: '',
    externalUserId: '',
    id: '',
    picture: '',
  };
  public static generate(dto: CreateUserDto) {
    const id = UUID.from(dto.id);
    const event = new UserSignedUp();
    event.new().forAggregate(id);
    event.details = dto;
    return event;
  }
}
export class UserActivated extends UserEvent {
  public readonly eventType = UserEventType.Activated;
  public details: { email: string } = { email: '' };
  public static generate(email: string) {
    const event = new UserActivated();
    event.new();
    event.details = { email };
    return event;
  }
}
export class UserDeactivated extends UserEvent {
  public readonly eventType = UserEventType.Deactivated;
  public details: { email: string } = { email: '' };
  public static generate(email: string) {
    const event = new UserDeactivated();
    event.new();
    event.details = { email };
    return event;
  }
}
export class UserDeleted extends UserEvent {
  public readonly eventType = UserEventType.Deleted;
  public details: { email: string } = { email: '' };
  public static generate(email: string) {
    const event = new UserDeleted();
    event.new();
    event.details = { email };
    return event;
  }
}
