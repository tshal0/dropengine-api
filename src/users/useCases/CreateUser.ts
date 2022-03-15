import {
  Injectable,
  Scope,
  UnprocessableEntityException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { DbUsersRepository } from "../database/DbUsersRepository";
import {
  CreateAuth0UserDto,
  CreateAuth0UserResponseDto,
  CreateUserDto,
  IAuth0ExtendedUser,
} from "../dto/CreateUserDto";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { IUser } from "@users/domain/interfaces/IUser";
import { UserEventType, UserSignedUp } from "../domain/events/UserEvent";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom, map } from "rxjs";
import { getCircularReplacer } from "@shared/utils";
import { User } from "@users/domain";
import { Auth0MgmtApiClient } from "@auth0/auth0-mgmt-api.service";
import { Auth0ExtendedUser } from "@auth0/domain/Auth0ExtendedUser";

@Injectable({ scope: Scope.DEFAULT })
export class CreateUserUseCase implements UseCase<CreateUserDto, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: DbUsersRepository,
    private auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${CreateUserUseCase.name}]`;
  }

  async execute(dto: CreateUserDto): Promise<Result<User>> {
    try {
      let result = await this._repo.load(dto);
      
      if (result.isFailure) {
        result = User.create(dto);
        if (result.isFailure) {
          return Result.fail(result.error);
        }
      }
      let user = result.value();

      try {
        const auth0Users = await this.auth0.getUsersByEmail(dto.email);
        if (auth0Users.length) {
          const auth0User = auth0Users[0];
          user.applyAuth0User(auth0User);
        } else {
          const auth0User = Auth0ExtendedUser.fromUser(user);
          const resp = await this.auth0.createUser(auth0User);
          user.applyAuth0User(resp.props());
        }

        result = await this._repo.save(user);
        return result;
      } catch (error) {
        this.logger.error(error.response.data);
        return Result.ok(user);
      }
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
