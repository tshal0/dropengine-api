import { Auth0MgmtApiClient } from "@auth0/auth0-mgmt-api.service";
import { Auth0ExtendedUser } from "@auth0/domain/Auth0ExtendedUser";
import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Result, UseCase } from "@shared/domain";
import { AzureLoggerService } from "@shared/modules";
import { UserEventType, UserSignedUp } from "@users/domain";
import moment from "moment";

@Injectable({ scope: Scope.DEFAULT })
export class HandleUserSignedUpUseCase implements UseCase<UserSignedUp, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private client: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${HandleUserSignedUpUseCase.name}]`;
  }
  private logInit(request: UserSignedUp) {
    const email = request.details.email;
    const log = `${this.llog} Creating User Account for ${email} in Auth0`;
    this.logger.debug(log);
  }
  @OnEvent(UserEventType.UserSignedUp, { async: true })
  async execute(request: UserSignedUp): Promise<Result<any>> {
    this.logInit(request);
    try {
      this.logger.debug({ request: request.props() });
      const email = request.details.email;
      // Update a users app_metadata -> merchants with its new code? and id?
      let accounts = await this.client.getUsersByEmail(email);
      // if (!accounts.length) {
      //   let auth0User = Auth0ExtendedUser.fromUserSignUp(request);
      //   auth0User = await this.client.createUser(auth0User);
      // }
      // let tasks = accounts.map(
      //   async (a) =>
      //     await this.client.patchUserAppMetadata(a.user_id, a.app_metadata)
      // );
      // let results = await Promise.all(tasks);
      return Result.ok();
    } catch (error) {
      this.logger.debug(`${this.llog}`, { error });
      this.logger.error(
        `Failed to Push User to Auth0` + `[${request.details.email}]`
      );
    }
  }
}
