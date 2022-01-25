import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { DbUsersRepository } from "../database/DbUsersRepository";
import * as moment from "moment";
import { Result } from "@shared/domain/Result";
import { IUser, User } from "../domain/entities/User";
import { UUID } from "@shared/domain/ValueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";

@Injectable({ scope: Scope.DEFAULT })
export class GetAllUsersUseCase implements UseCase<any, IUser[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repository: DbUsersRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetAllUsersUseCase.name}]`;
  }

  async execute(): Promise<Result<IUser[]>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let results = await this._repository.findAll();
      let users = results.map((e) => e.getProps());
      return Result.ok(users);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
