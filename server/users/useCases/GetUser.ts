import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from '@shared/domain/UseCase';
import { DbUsersRepository } from '../database/DbUsersRepository';
import * as moment from 'moment';
import { Result } from '@shared/domain/Result';
import { User } from '../domain/entities/User';
import { UUID } from '@shared/domain/ValueObjects';
import { EntityNotFoundException } from '@shared/exceptions/entitynotfound.exception';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';

@Injectable({ scope: Scope.DEFAULT })
export class GetUserUseCase implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repository: DbUsersRepository,
  ) {}
  get llog() {
    return `[${moment()}][${GetUserUseCase.name}]`;
  }

  async execute(id: UUID): Promise<Result<User>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let exists = await this._repository.exists(id);
      if (exists) {
        let user = await this._repository.findById(id);
        this.logger.log(`${this.llog} Returning user...`);
        return Result.ok(user);
      } else {
        throw new EntityNotFoundException(`Entity Not Found: User.`, id.value);
      }
    } catch (error) {
      let err = User.errorResult(error, id);
      return err;
    }
  }
}
