import { StoreId } from "@identity/domain/valueObjects/StoreId";

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotImplementedException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";

import { EntityNotFoundException } from "@shared/exceptions";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { User } from "@identity/domain";
import { Result } from "@shared/domain";
import { Store } from "@identity/domain/aggregates/Store";
import { AddStoreUseCase } from "@identity/useCases/Store/AddStore";
import {
  IStoreResponseDto,
  StoreResponseDto,
} from "@identity/dto/StoreResponseDto";
import { CreateStoreDto } from "@identity/dto/CreateStoreDto";

@Controller("identity/stores")
export class StoresController {
  private readonly logger: Logger = new Logger(StoresController.name);

  constructor(private readonly auth0: Auth0MgmtApiClient) {}
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
