import { UUID } from "@shared/domain";
import { IDomainEventProps } from "@shared/domain/events/BaseDomainEvents";
import { UserEvent } from "../events/UserEvent";

export interface IUser {
  id: UUID;
  externalUserId?: string | undefined;
  email: string;
  status: any;
  picture: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProps {
  id: string;
  externalUserId?: string | undefined;
  email: string;
  status: any;
  picture: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
