import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule } from "@shared/modules/azure-logger/azure-logger.module";
import { PrismaModule } from "@shared/modules/prisma/prisma.module";
import { UsersController } from "./api/UsersController";
import { DbUsersRepository } from "./database/DbUsersRepository";
import { CreateUserUseCase } from "./useCases/CreateUser";
import { DeleteUserUseCase } from "./useCases/DeleteUser";
import { GetAllUsersUseCase } from "./useCases/GetAllUsers";
import { GetUserUseCase } from "./useCases/GetUser";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule,
    AzureLoggerModule,
    PrismaModule,
    ConfigModule,
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [
    DbUsersRepository,
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
