import { Auth0Module } from "@auth0/auth0.module";
import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule, AzureStorageModule } from "@shared/modules";
import { AccountsController } from "./api/AccountsController";
import { UsersController } from "./api/UsersController";
import { AccountsRepository } from "./database/AccountsRepository";
import {
  GetUserUseCase,
  GetAllUsersUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
} from "./useCases";
import { AddMembersUseCase } from "./useCases/Account/AddMember";
import { CreateAccountUseCase } from "./useCases/Account/CreateAccount";
import { DeleteAccountUseCase } from "./useCases/Account/DeleteAccount";
import { GetAccountUseCase } from "./useCases/Account/GetAccount";
import { GetAccountsUseCase } from "./useCases/Account/GetAllAccounts";
import { RemoveMembersUseCase } from "./useCases/Account/RemoveMember";
import { RemoveAllUserAccountsUseCase } from "./useCases/User/RemoveAllUserAccounts";

@Module({
  controllers: [UsersController, AccountsController],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule,
    AzureLoggerModule,
    ConfigModule,
    CacheModule.register(),
    AzureStorageModule,
    Auth0Module,
  ],
  providers: [
    AccountsRepository,
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    CreateAccountUseCase,
    GetAccountUseCase,
    GetAccountsUseCase,
    DeleteAccountUseCase,
    RemoveAllUserAccountsUseCase,
    AddMembersUseCase,
    RemoveMembersUseCase,
  ],
})
export class AccountsModule {}
