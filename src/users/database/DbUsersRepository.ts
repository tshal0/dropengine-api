import { Injectable } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/ValueObjects";
import { EntityAlreadyExistsException } from "@shared/exceptions/entityalreadyexists.exception";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { Prisma } from ".prisma/client";

import * as moment from "moment";
import { User } from "../domain/entities/User";
import { CreateUserDto } from "../dto/CreateUserDto";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { DbUser } from "@shared/modules/prisma/models/User";
import { PrismaService } from "@shared/modules/prisma/prisma.service";
export class UserNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`User not found with ID: ${id}`, id, `USER_NOT_FOUND`);
  }
}
export class UserNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`User not found with Email: ${id}`, id, `USER_NOT_FOUND`);
  }
}

@Injectable()
export class DbUsersRepository {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly db: PrismaService
  ) {}
  get llog() {
    return `[${moment()}][${DbUsersRepository.name}]`;
  }
  private static errorResult<T>(error: any, value: any) {
    const err = new Error(error?.message || error);
    const resultError = new ResultError(err, [], value);
    const result = Result.fail<T>(resultError);
    return result;
  }
  async findAll(): Promise<User[]> {
    try {
      const result = await this.db.user
        .findMany({
          include: {
            events: true,
          },
        })
        .then((user) => {
          return Result.ok<DbUser[]>(user);
        })
        .catch((err) => {
          this.logger.error(err);
          throw err;
        });

      if (result.isSuccess) {
        const entities = result.getValue();
        const users = entities.map((e) => User.fromDb(e));
        return users;
      } else {
        throw result.error;
      }
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to find users.`);
      if (err.name == `NotFoundError`) {
        throw new UserNotFoundException(``);
      }
      throw err;
    }
  }
  async exists(id: UUID): Promise<boolean> {
    const result = await this.db.user
      .findFirst({
        where: {
          id: id.value,
        },
        rejectOnNotFound: true,
      })
      .then((user) => {
        return Result.ok(user);
      })
      .catch((err) => {
        return DbUsersRepository.errorResult<DbUser>(err, id);
      });
    return result.isSuccess;
  }

  async findById(id: UUID): Promise<User> {
    try {
      const result = await this.db.user
        .findFirst({
          where: {
            id: id.value,
          },
          include: {
            events: true,
          },
          rejectOnNotFound: true,
        })
        .then((user) => {
          return Result.ok<DbUser>(user);
        })
        .catch((err) => {
          this.logger.error(err);
          throw err;
        });

      if (result.isSuccess) {
        const entity = result.getValue();
        const user = User.fromDb(entity);
        return user;
      } else {
        throw result.error;
      }
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to find aggregate ${id.value}`);
      if (err.name == `NotFoundError`) {
        throw new UserNotFoundException(id.value);
      }
      throw err;
    }
  }
  async findByEmail(email: string): Promise<User> {
    this.logger.debug(`${this.llog} Loading aggregate by email...`);
    try {
      const result = await this.db.user
        .findFirst({
          where: {
            email: email,
          },
          include: {},
          rejectOnNotFound: true,
        })
        .then((user) => {
          return user;
        })
        .catch((err) => {
          throw err;
        });

      const user = User.fromDb(result);
      return user;
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to load aggregate ${email}`);
      throw err;
    }
  }
  async loadAggregate(id: UUID): Promise<User> {
    this.logger.debug(`${this.llog} Loading aggregate...`);
    try {
      const result = await this.db.user
        .findFirst({
          where: {
            id: id.value,
          },
          include: { events: false },
          rejectOnNotFound: true,
        })
        .then((user) => {
          return Result.ok<DbUser>(user);
        })
        .catch((err) => {
          throw err;
        });

      if (result.isSuccess) {
        const entity = result.getValue();
        const user = User.fromDb(entity);
        return user;
      }
    } catch (err: any) {
      this.logger.error(`${this.llog} Failed to load aggregate ${id.value}`);
      throw err;
    }
  }

  async persist(user: User): Promise<User> {
    try {
      const props = user.toUpsert();
      const id = props.id;

      const userTrx = this.db.user.upsert({
        where: { id: id },
        update: {
          ...props,
          events: {
            createMany: {
              data: props.events,
            },
          },
        },
        create: {
          ...props,
          events: {
            createMany: {
              data: props.events,
            },
          },
        },
        include: {
          events: false,
        },
      });

      const result = await this.db
        .$transaction([userTrx])
        .then(([user]) => {
          this.logger.debug(
            `${this.llog}Successfully persisted user ${user.id}`
          );
          return Result.ok<DbUser>(user);
        })
        .catch((err) => {
          const error = new Error(err?.name ?? err?.message);
          this.logger.error(error.message, error.stack);
          throw err;
        });
      if (result.isSuccess) {
        const entity = result.getValue();
        const user = User.fromDb(entity);
        return user;
      } else {
        this.logger.error(`${this.llog} Failed To Save User ${id}`);
        throw result.error;
      }
    } catch (err: any) {
      const error = new Error(err?.name ?? err?.message);
      this.logger.error(error.message, error.stack);
      this.logger.debug(JSON.stringify(error, null, 2));
      throw err;
    }
  }

  async delete(id: UUID): Promise<Result<boolean>> {
    const userId = id.value;
    const result = await this.db.user
      .delete({
        where: {
          id: userId,
        },
      })
      .then((user) => {
        return Result.ok<DbUser>(user as DbUser);
      })
      .catch((err) => {
        return Result.fail(err);
      });
    try {
      if (result.isSuccess) {
        return Result.ok();
      } else {
        return Result.fail(result.error, userId);
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }

  async create(dto: CreateUserDto): Promise<DbUser> {
    try {
      const entity = await this.db.user.create({
        data: {
          ...dto,
        },
        include: {},
      });
      this.logger.log(
        `Successfully created User: ${entity.email} ${entity.id}.`,
        entity
      );
      return entity;
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(err.message, err.stack, { ...err });
        if (err.code === "P2002") {
          const target =
            err.meta &&
            err.meta["target"] &&
            err.meta["target"].length &&
            err.meta["target"][0];
          throw new EntityAlreadyExistsException(
            `Entity already exists with duplicate property '${target}'.`,
            dto[target]
          );
        }
      }
    }
  }

  async update() {
    return;
  }
}
