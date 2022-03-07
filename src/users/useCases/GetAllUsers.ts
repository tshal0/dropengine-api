import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { DbUsersRepository } from "../database/DbUsersRepository";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { IUser } from "@users/domain/interfaces/IUser";
import { User } from "@users/domain";

@Injectable({ scope: Scope.DEFAULT })
export class GetAllUsersUseCase implements UseCase<any, User[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: DbUsersRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetAllUsersUseCase.name}]`;
  }

  async execute(): Promise<Result<User[]>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let results = await this._repo.findAll();
      let users = results.map((e) => e.value());
      return Result.ok(users);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
