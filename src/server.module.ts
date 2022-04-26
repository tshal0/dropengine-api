import { CacheModule, Module } from "@nestjs/common";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
  NestLikeConsoleFormatOptions,
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from "nest-winston";
import * as winston from "winston";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { AzureTelemetryModule } from "@shared/modules/azure-telemetry/azure-telemetry.module";
import { AzureStorageModule } from "@shared/modules/azure-storage/azure-storage.module";
import { AuthModule } from "@shared/modules/auth/auth.module";
import { AppModule } from "./app/app.module";
import { ShopifyModule } from "./shopify/shopify.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PassportModule } from "@nestjs/passport";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CatalogModule } from "./catalog/catalog.module";
import { Auth0Module } from "@auth0/auth0.module";
import { AccountsModule } from "./accounts/accounts.module";
import { SalesModule } from "./sales/sales.module";
import { MyEasySuiteModule } from "./myeasysuite/MyEasySuiteModule";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "@shared/filters";
import { format } from "winston";
import { Format } from "logform";
import chalk from "chalk";
import {
  nestFormat,
  winstonLoggerOptions,
} from "./shared/modules/winston-logger/winstonLogger";
import { WinstonLogger } from "./shared";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),

    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        uri: cfg.get<string>("MONGO_CONNECTION_STRING"),
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot({
      entities: ["./dist/**/entities/*.entity.js"],
      entitiesTs: ["./src/**/entities/*.entity.ts"],
      clientUrl: process.env.DATABASE_URL || undefined,
      driverOptions: {
        connection: { ssl: process.env.POSTGRES_SSL || false },
      },
      debug: true,
      type: "postgresql",
    }),
    AuthModule,

    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule,
    AzureTelemetryModule,
    AzureStorageModule,
    CacheModule.register(),
    // PrismaModule,
    AppModule,
    Auth0Module,
    AccountsModule,
    ShopifyModule,
    CatalogModule,
    SalesModule,
    MyEasySuiteModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: WINSTON_MODULE_PROVIDER,
      useClass: WinstonLogger,
    },
  ],
})
export class ServerModule {}
