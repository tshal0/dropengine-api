import { Injectable } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityAlreadyExistsException } from "@shared/exceptions/entityalreadyexists.exception";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { CreateUserDto } from "../dto/CreateUserDto";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { IUserProps, User } from "@users/domain";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { DbUser } from "@users/domain/entities/User.entity";
import { FailedToCreateError, FailedToSaveError } from "@shared/database";
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

export interface IDbUserRepository {
  load(dto: CreateUserDto | UUID | string): Promise<Result<User>>;
}

@Injectable()
export class DbUsersRepository implements IDbUserRepository {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly em: EntityManager
  ) {}

  public async delete(user: User) {
    try {
      let repo = this.em.getRepository(DbUser);
      await repo.removeAndFlush(user.entity());
      return Result.ok(user);
    } catch (error) {
      this.logger.log(
        `${this.llog} Failed to Delete User '${user.id}' ${user.email}`
      );
      return Result.fail(error);
    }
  }

  public async findAll() {
    let repo = this.em.getRepository(DbUser);
    let entities = await repo.findAll();
    let results = entities.map((e) => User.db(e));
    return results;
  }
  public async load(dto: CreateUserDto | UUID | string): Promise<Result<User>> {
    try {
      let repo = this.em.getRepository(DbUser);

      if (dto instanceof CreateUserDto) {
        return await this.loadByDto(dto, repo);
      } else if (dto instanceof UUID) {
        return await this.loadByUuid(dto, repo);
      } else if (typeof dto == "string") {
        return await this.loadByEmail(dto, repo);
      }
    } catch (error) {
      //TODO: UserNotFound
      return Result.fail(error);
    }
  }
  private async loadByDto(dto: CreateUserDto, repo: EntityRepository<DbUser>) {
    let dbe: DbUser = null;
    if (dto.id?.length) {
      dbe = await repo.findOne({ id: dto.id });
    } else if (dto.email?.length) {
      dbe = await repo.findOne({ email: dto.email });
    } else {
      //TODO: InvalidUser: MissingIdentifier
    }
    if (!dbe) {
      return User.create(dto);
    }
    return User.db(dbe);
  }
  private async loadByUuid(id: UUID, repo: EntityRepository<DbUser>) {
    let dbe = await repo.findOne({ id: id.value() });

    if (dbe) {
      return User.db(dbe);
    }

    throw new EntityNotFoundException(`UserNotFound`, id.value());
  }
  private async loadByEmail(email: string, repo: EntityRepository<DbUser>) {
    let dbe = await repo.findOne({ email: email });

    if (dbe) {
      return User.db(dbe);
    }

    throw new EntityNotFoundException(`UserNotFound`, email);
  }

  /**
   * Persists the User Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg User Aggregate to be persisted.
   * @returns {Result<User>}
   */
  public async save(agg: User): Promise<Result<User>> {
    let result: Result<User> = null;
    const props = agg?.props();
    try {
      if (props.id?.length) {
        result = await this.upsertByUuid(agg);
      }
      if (props.email?.length) {
        result = await this.upsertByEmail(agg);
      } else {
        result = await this.create(props);
      }
      return result;
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async upsertByUuid(product: User): Promise<Result<User>> {
    try {
      let repo = this.em.getRepository(DbUser);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async upsertByEmail(product: User): Promise<Result<User>> {
    try {
      let repo = this.em.getRepository(DbUser);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async create(props: IUserProps): Promise<Result<User>> {
    try {
      let repo = this.em.getRepository(DbUser);
      let dbe: DbUser = null;
      dbe = await repo.create(props);
      return await this.persist(repo, dbe);
    } catch (err) {
      return this.failedToCreate(props, err);
    }
  }
  private async persist(
    repo: EntityRepository<DbUser>,
    dbe: DbUser
  ): Promise<Result<User>> {
    await repo.persistAndFlush(dbe);
    let result = User.db(dbe);
    return result;
  }

  private failedToCreate(props: IUserProps, err: any) {
    this.logger.error(err);
    return Result.fail<User>(
      new FailedToCreateError(
        {
          id: props.id,
          type: User.name,
          name: props.email,
        },
        err.message
      )
    );
  }
  private failedToSave(props: IUserProps, err: any) {
    this.logger.error(err);
    return Result.fail<User>(
      new FailedToSaveError(
        {
          id: props.id,
          type: User.name,
          name: props.email,
        },
        err.message
      )
    );
  }

  get llog() {
    return `[${moment()}][${DbUsersRepository.name}]`;
  }
  private static errorResult<T>(error: any, value: any) {
    const err = new Error(error?.message || error);
    const resultError = new ResultError(err, [], value);
    const result = Result.fail<T>(resultError);
    return result;
  }
}
