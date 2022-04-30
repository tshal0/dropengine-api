import {
  CacheModule,
  DynamicModule,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { AzureTelemetryModule } from "@shared/modules/azure-telemetry/azure-telemetry.module";
import { AzureStorageModule } from "@shared/modules/azure-storage/azure-storage.module";
import { AuthModule } from "@shared/modules/auth/auth.module";
import { HealthModule } from "./health/health.module";
import { ShopifyModule } from "./shopify/shopify.module";
import { PassportModule } from "@nestjs/passport";
import { MikroOrmModule, MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { CatalogModule } from "./catalog/catalog.module";
import { Auth0Module } from "@auth0/auth0.module";
import { AccountsModule } from "./accounts/accounts.module";
import { SalesModule } from "./sales/sales.module";
import { MyEasySuiteModule } from "./myeasysuite/MyEasySuiteModule";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "@shared/filters";
import { winstonLoggerOptions } from "@shared/modules/winston-logger/winstonLogger";
import { MikroORM } from "@mikro-orm/core";
import { mikroOrmOptions } from "./mikroOrmOptions";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_LOCATION || ".env",
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        ...winstonLoggerOptions,
      }),
      inject: [],
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        uri: cfg.get<string>("MONGO_CONNECTION_STRING"),
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot(mikroOrmOptions),
    AuthModule,

    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule,
    AzureTelemetryModule,
    AzureStorageModule,
    CacheModule.register(),
    // PrismaModule,
    HealthModule,
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
  ],
})
export class AppModule implements OnModuleDestroy, OnModuleInit {
  constructor(private orm: MikroORM) {}
  async onModuleInit() {
    console.log(this.orm.config.get("baseDir"));
  }

  async onModuleDestroy(): Promise<void> {
    await this.orm.close();
  }
  static register(options?: {
    mikroOrmOptions?: MikroOrmModuleOptions;
  }): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MikroOrmModule.forRoot({
          entities: ["./dist/**/entities/*.entity.js"],
          entitiesTs: ["./src/**/entities/*.entity.ts"],
          clientUrl: process.env.DATABASE_URL || undefined,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          dbName: process.env.DB_NAME,
          schema: process.env.DB_SCHEMA,
          driverOptions: {
            connection: { ssl: process.env.POSTGRES_SSL || false },
          },
          debug: true,
          type: "postgresql",
          ...options?.mikroOrmOptions,
        }),
      ],
    };
  }
}
