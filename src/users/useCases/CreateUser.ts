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
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { IUser } from "@users/domain/interfaces/IUser";
import { UserEventType, UserSignedUp } from "../domain/events/UserEvent";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { getCircularReplacer } from "@shared/utils";
import { User } from "@users/domain";

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

      // this.eventEmitter.emit(UserEventType.UserSignedUp, event);
      // user = await this._repo.loadAggregate(user.id);

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
      try {
        const resp$ = await this.http.post<CreateAuth0UserResponseDto>(
          url,
          payload
        );
        // Save response (externalUserId)
        const resp = await lastValueFrom(resp$);
        this.logger.log(`${this.llog} Auth0 Response:`, {
          resp: JSON.stringify(resp.data, null, 2),
        });
        result = user.applyAuth0Response(resp.data);
        if (result.isFailure) {
          //TODO: FailedToCreateAuth0User
          return Result.fail(result.error);
        }
        user = result.value();
        result = await this._repo.save(user);
        return result;
      } catch (error) {
        this.logger.debug(error.response.data);
        throw error;
      }
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
