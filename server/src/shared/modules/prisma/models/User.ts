import { User, UserEvent, UserStatus } from '@prisma/client';

export type DbUserEvent = UserEvent;
export type DbUserStatus = UserStatus;
export type DbUser = User & { events?: UserEvent[] };
