import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { CreateUserDto } from "../../dto/CreateUserDto";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { Auth0User } from "@auth0/domain/Auth0ExtendedUser";
import { User } from "../../domain/aggregates/User";

@Injectable({ scope: Scope.DEFAULT })
export class CreateUserUseCase implements UseCase<CreateUserDto, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${CreateUserUseCase.name}]`;
  }

  async execute(dto: CreateUserDto): Promise<Result<User>> {
    try {
      try {
        const auth0Users = await this.auth0.getUsersByEmail(dto.email);
        if (auth0Users.length) {
          const auth0User = auth0Users[0];
          const user = User.fromAuth0User(auth0User);
          return Result.ok(user);
        } else {
          const auth0User = Auth0User.create(dto);
          const resp = await this.auth0.createUser(auth0User, dto.password);
          const user = User.fromAuth0User(resp);
          return Result.ok(user);
        }
      } catch (error) {
        this.logger.error(error.response.data);
        return Result.fail(error);
      }
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
