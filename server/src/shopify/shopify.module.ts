import {
  CacheModule,
  CACHE_MANAGER,
  Inject,
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { Cache } from "cache-manager";

import { ShopifyController } from "./shopify.controller";
import { ShopifyApiController } from "./api/shopify.api.controller";
import { HttpService, HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as https from "https";
import { ShopifyApiClient } from "./ShopifyApiClient";
import { ConnectShopifyAccountUseCase } from "./useCases/ConnectShopifyAccount";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule } from "@shared/modules/azure-logger/azure-logger.module";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { DbShopifyAccountsRepository } from "./database/DbShopifyAccountsRepository";
import { PrismaModule } from "@shared/modules/prisma/prisma.module";
import { GetShopifyAccountUseCase } from "./useCases/GetShopifyAccount";
import { AcceptShopifyInstallUseCase } from "./useCases/AcceptShopifyInstallUseCase";
import { DeleteShopifyAccountUseCase } from "./useCases/DeleteShopifyAccount";
import { GetAllAccountsUseCase } from "./useCases/GetAllAccounts";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    PrismaModule,
    AzureLoggerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule, CacheModule.register()],
      useFactory: async (config: ConfigService, cache: Cache) => {
        const httpConfig = {
          baseURL: ``,
          headers: { Authorization: `Bearer ` },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),

          "axios-retry": {
            retryDelay: (retryCount) => retryCount * 1000,
          },
        };

        return httpConfig;
      },
      inject: [ConfigService, CACHE_MANAGER],
    }),
  ],
  controllers: [ShopifyController, ShopifyApiController],
  providers: [
    DbShopifyAccountsRepository,
    ShopifyApiClient,
    ConnectShopifyAccountUseCase,
    GetShopifyAccountUseCase,
    AcceptShopifyInstallUseCase,
    DeleteShopifyAccountUseCase,
    GetAllAccountsUseCase,
  ],
  exports: [],
})
export class ShopifyModule {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AzureLoggerService
  ) {}

  public onModuleInit(): any {
    // Add request interceptor and response interceptor to log request infos
    const axios = this.httpService.axiosRef;
    axios.interceptors.request.use(function (config) {
      // Please don't tell my Typescript compiler...
      config["metadata"] = { ...config["metadata"], startDate: new Date() };
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config["metadata"] = { ...config["metadata"], endDate: new Date() };
        const duration =
          config["metadata"].endDate.getTime() -
          config["metadata"].startDate.getTime();

        // Log some request infos (you can actually extract a lot more if you want: the content type, the content size, etc.)
        this.logger.log(
          `${config.method.toUpperCase()} ${config.url} ${duration}ms`
        );

        return response;
      },
      (err) => {
        this.logger.error(err);
        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      }
    );
  }
}
