import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureLoggerModule } from '@shared/modules/azure-logger/azure-logger.module';
import { PrismaModule } from '@shared/modules/prisma/prisma.module';
import { UsersController } from './api/UsersController';
import { DbUsersRepository } from './database/DbUsersRepository';
import { CreateUserUseCase } from './useCases/CreateUser';
import { GetUserUseCase } from './useCases/GetUser';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AzureLoggerModule,
    PrismaModule,
  ],
  controllers: [UsersController],
  providers: [DbUsersRepository, CreateUserUseCase, GetUserUseCase],
})
export class UsersModule {}
