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
} from "../dto/CreateUserDto";
import * as moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { IUser, User } from "../domain/entities/User";
import { UserEventType, UserSignedUp } from "../domain/events/UserEvent";
import { UUID } from "@shared/domain/ValueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { getCircularReplacer } from "@shared/utils";

@Injectable({ scope: Scope.DEFAULT })
export class CreateUserUseCase implements UseCase<CreateUserDto, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: DbUsersRepository
  ) {}
  get llog() {
    return `[${moment()}][${CreateUserUseCase.name}]`;
  }

  async execute(dto: CreateUserDto): Promise<Result<IUser>> {
    try {
      let user = User.create();
      user.signUp(dto);
      let event = user.getProps().events[0];
      user = await this._repo.persist(user);
      this.eventEmitter.emit(UserEventType.UserSignedUp, event);
      user = await this._repo.loadAggregate(user.id);

      const AUTH0_CLIENT_ID = this.config.get(`AUTH0_CLIENT_ID`);
      const AUTH0_DOMAIN = this.config.get(`AUTH0_DOMAIN`);
      const CONNECTION = `Username-Password-Authentication`;

      const url = `https://${AUTH0_DOMAIN}/dbconnections/signup`;

      // Generate Auth0 CreateUser payload
      let payload: CreateAuth0UserDto = {
        client_id: AUTH0_CLIENT_ID,
        connection: CONNECTION,
        email: dto.email,
        password: dto.password,
        given_name: dto.firstName,
        family_name: dto.lastName,
      };

      // CreateUser in Auth0
      const resp$ = await this.http.post<CreateAuth0UserResponseDto>(
        url,
        payload
      );
      // Save response (externalUserId)
      const resp = await lastValueFrom(resp$);
      this.logger.log(`${this.llog} Auth0 Response:`, {
        resp: JSON.stringify(resp.data, null, 2),
      });
      user.updateAuth0Details(resp.data);
      const auth0Event = user.getProps().events[0];

      user = await this._repo.persist(user);
      this.eventEmitter.emit(UserEventType.UserCreatedInAuth0, auth0Event);
      user = await this._repo.loadAggregate(user.id);

      return Result.ok(user.getProps());
    } catch (error) {
      let err = User.errorResult(error, dto);
      return Result.fail(new ResultError(err.error, [error], { dto }));
    }
  }
}
