import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { DbUsersRepository } from "../database/DbUsersRepository";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { User } from "@users/domain";

@Injectable({ scope: Scope.DEFAULT })
export class GetUserUseCase implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: DbUsersRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetUserUseCase.name}]`;
  }

  async execute(id: UUID): Promise<Result<User>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let result = await this._repo.load(id);
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { id: id.value() }));
    }
  }
}
