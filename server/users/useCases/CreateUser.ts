import {
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from '@shared/domain/UseCase';
import { DbUsersRepository } from '../database/DbUsersRepository';
import { CreateUserDto } from '../dto/CreateUserDto';
import * as moment from 'moment';
import { Result } from '@shared/domain/Result';
import { User } from '../domain/entities/User';
import { UserEventType, UserSignedUp } from '../domain/events/UserEvent';
import { UUID } from '@shared/domain/ValueObjects';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';

@Injectable({ scope: Scope.DEFAULT })
export class CreateUserUseCase implements UseCase<CreateUserDto, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repository: DbUsersRepository,
  ) {}
  get llog() {
    return `[${moment()}][${CreateUserUseCase.name}]`;
  }

  async execute(dto: CreateUserDto): Promise<Result<User>> {
    try {
      let id = UUID.from(dto.id);
      let exists = await this._repository.exists(id);
      if (exists) {
        let user = await this._repository.findById(id);
        return Result.ok(user);
      }
      let event = UserSignedUp.generate(dto);
      let user = User.init(id);
      user.signUp(event);
      user = await this._repository.persist(user);
      user = await this._repository.findById(id);
      this.eventEmitter.emit(UserEventType.UserSignedUp, event);
      return Result.ok(user);
    } catch (error) {
      let err = User.errorResult(error, dto);
      return err;
    }
  }
}
