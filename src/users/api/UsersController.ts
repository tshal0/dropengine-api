import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UUID } from "@shared/domain/ValueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { Request, Response } from "express";
import { IUser } from "../domain/entities/User";
import { CreateUserDto } from "../dto/CreateUserDto";
import { CreateUserUseCase } from "../useCases/CreateUser";
import { DeleteUserUseCase } from "../useCases/DeleteUser";
import { GetAllUsersUseCase } from "../useCases/GetAllUsers";
import { GetUserUseCase } from "../useCases/GetUser";

@Controller("/api/users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly logger: AzureLoggerService,
    private readonly getUser: GetUserUseCase,
    private readonly getAll: GetAllUsersUseCase,
    private readonly deleteUser: DeleteUserUseCase
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.getUser.execute(uuid);
    if (result.isSuccess) {
      return result.getValue().getProps();
    }
  }
  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.deleteUser.execute(uuid);
    if (result.isSuccess) {
      return result.getValue();
    }
  }
  @Post()
  async post(@Body() dto: CreateUserDto): Promise<IUser> {
    let result = await this.createUser.execute(dto);
    if (result.isSuccess) {
      return result.getValue();
    } else {
      throw new UnprocessableEntityException(result.error);
    }
  }
  @Get()
  @UseGuards(AuthGuard())
  async getAllUsers(): Promise<IUser[]> {
    let result = await this.getAll.execute();
    if (result.isSuccess) {
      return result.getValue();
    }
  }
}
