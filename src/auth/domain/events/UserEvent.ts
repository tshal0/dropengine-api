import { AggregateType } from "@shared/domain/events/AggregateType";
import {
  BaseDomainEvent,
  IDomainEventProps,
} from "@shared/domain/events/BaseDomainEvents";
import { UUID } from "@shared/domain/valueObjects";
import moment from "moment";
import {
  CreateAuth0UserResponseDto,
  CreateUserDto,
} from "../../dto/CreateUserDto";
export const UserEventType = {
  Unknown: "Unknown",
  UserSignedUp: "UserSignedUp",
  UserCreatedInAuth0: "UserCreatedInAuth0",
  Activated: "Activated",
  Deactivated: "Deactivated",
  Deleted: "Deleted",
};
import safeJsonStringify from "safe-json-stringify";

export class UserEvent extends BaseDomainEvent {
  public readonly aggregateType = AggregateType.User;
  public eventType = UserEventType.Unknown;
  public details: any;
  fromDbEvent(dbEvent: any) {
    this.eventId = UUID.from(dbEvent.eventId).value();
    this.eventType = UserEventType[dbEvent.eventType];
    this.aggregateId = UUID.from(dbEvent.aggregateId).value();
    this.timestamp = moment(dbEvent.timestamp).toDate();
    this.details = JSON.parse(dbEvent.details);
    return this;
  }
  toDbEvent(): any {
    return {
      eventId: this.getEventId(),
      eventType: this.getEventType(),
      aggregateId: undefined,
      aggregateType: "User",
      timestamp: this.timestamp,
      details: safeJsonStringify({ ...this.details }),
    };
  }
  public static generateUuid() {
    return UUID.generate();
  }
  public withDetails(details: any) {
    this.details = details;
    return this;
  }
}
export class UserSignedUp extends UserEvent {
  public readonly eventType = UserEventType.UserSignedUp;
  public details: CreateUserDto = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };
  public static generate(userId: UUID, dto: CreateUserDto) {
    const event = new UserSignedUp();
    event.new().forAggregate(userId).withDetails(dto);
    return event;
  }
  public withDetails(dto: CreateUserDto) {
    this.details = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: undefined,
    };
    return this;
  }
}
export class UserCreatedInAuth0 extends UserEvent {
  public readonly eventType = UserEventType.UserCreatedInAuth0;
  public details: CreateAuth0UserResponseDto = {
    _id: "",
    email_verified: false,
    email: "",
    username: "",
    given_name: "",
    family_name: "",
    name: "",
    nickname: "",
    picture: "",
  };
  public static generate(userId: UUID, dto: CreateAuth0UserResponseDto) {
    const event = new UserCreatedInAuth0();
    event.new().forAggregate(userId).withDetails(dto);
    return event;
  }
  public withDetails(dto: CreateAuth0UserResponseDto) {
    this.details = dto;
    return this;
  }
}
export class UserActivated extends UserEvent {
  public readonly eventType = UserEventType.Activated;
  public details: { email: string } = { email: "" };
  public static generate(email: string) {
    const event = new UserActivated();
    event.new().withDetails({ email });
    return event;
  }
}
export class UserDeactivated extends UserEvent {
  public readonly eventType = UserEventType.Deactivated;
  public details: { email: string } = { email: "" };
  public static generate(email: string) {
    const event = new UserDeactivated();
    event.new().withDetails({ email });
    return event;
  }
}
export class UserDeleted extends UserEvent {
  public readonly eventType = UserEventType.Deleted;
  public details: { email: string } = { email: "" };
  public static generate(email: string) {
    const event = new UserDeleted();
    event.new().withDetails({ email });
    return event;
  }
}
