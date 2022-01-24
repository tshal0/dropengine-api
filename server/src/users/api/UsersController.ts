import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from '@shared/domain/ValueObjects';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dto/CreateUserDto';
import { CreateUserUseCase } from '../useCases/CreateUser';
import { GetUserUseCase } from '../useCases/GetUser';
@UseGuards(AuthGuard())
@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly logger: AzureLoggerService,
    private readonly getUser: GetUserUseCase,
  ) {}
  @Get(':id')
  async get(@Param('id') id: string) {
    let uuid = UUID.from(id);
    let result = await this.getUser.execute(uuid);
    if (result.isSuccess) {
      return result.getValue().getProps();
    }
  }
  @Post()
  async post(@Body() dto: CreateUserDto) {
    let result = await this.createUser.execute(dto);
    if (result.isSuccess) {
      return result.getValue().getProps();
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
}
