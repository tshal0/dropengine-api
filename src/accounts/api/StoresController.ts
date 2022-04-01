import { StoreId } from "@accounts/domain/valueObjects/StoreId";

import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";

import { EntityNotFoundException } from "@shared/exceptions";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { User } from "@accounts/domain";
import { Result } from "@shared/domain";
import { Store } from "@accounts/domain/aggregates/Store";
import { AddStoreUseCase } from "@accounts/useCases/Store/AddStore";
import {
  IStoreResponseDto,
  StoreResponseDto,
} from "@accounts/dto/StoreResponseDto";
import { CreateStoreDto } from "@accounts/dto/CreateStoreDto";

@Controller("/api/stores")
export class StoresController {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly auth0: Auth0MgmtApiClient,
  ) {}
  @Get(":id")
  @UseGuards(AuthGuard())
  async get(@Param("id") id: string): Promise<IStoreResponseDto> {
    throw new NotImplementedException();
    // let result = await this.getStore.execute(id);
    // if (result.isFailure) {
    //   throw new EntityNotFoundException(
    //     `Failed to Find Store '${id}'`,
    //     id,
    //     result.error.message
    //   );
    // }
    // return await this.generateStoreResponse(result.value());
  }

  @Delete(":id")
  @UseGuards(AuthGuard())
  async delete(@Param("id") id: string) {
    throw new NotImplementedException();
    // let result = await this.deleteStore.execute(StoreId.from(id).value());
    // if (result.isSuccess) {
    //   return result.value();
    // }
  }

  
  @Get()
  @UseGuards(AuthGuard())
  async query(): Promise<IStoreResponseDto[]> {
    throw new NotImplementedException();
    // let result = await this.getStores.execute();
    // if (result.isFailure) {
    //   throw new UnprocessableEntityException(
    //     result.error,
    //     `Failed to Fetch All Stores`
    //   );
    // }
    // let resp = result.value().map((a) => StoreResponseDto.from(a).json());
    // return resp;
  }
  private async generateStoreResponse(acct: Store) {
    let json = StoreResponseDto.from(acct).json();
    return json;
  }
}
