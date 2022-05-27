import {
  CacheModule,
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
import { HealthModule } from "./health/health.module";
import { ShopifyModule } from "./shopify/shopify.module";
import { PassportModule } from "@nestjs/passport";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CatalogModule } from "./catalog/catalog.module";
import { Auth0Module } from "@auth0/auth0.module";
import { SalesModule } from "./sales/sales.module";
import { MyEasySuiteModule } from "./myeasysuite/myeasysuite.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "@shared/filters";
import { winstonLoggerOptions } from "@shared/modules/winston-logger/winstonLogger";
import { MikroORM } from "@mikro-orm/core";
import { mikroOrmOptions } from "./mikroOrmOptions";
import { AuthModule } from "./auth/auth.module";
import { AuthenticationModule } from "./shared";
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { DirectiveLocation, GraphQLDirective, GraphQLError, GraphQLFormattedError } from "graphql";
import { upperDirectiveTransformer } from "@shared/graphql";

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

    CacheModule.register(),
    HttpModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    AuthenticationModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        uri: cfg.get<string>("MONGO_CONNECTION_STRING"),
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot(mikroOrmOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: new Boolean(process.env.GRAPHQL_PLAYGROUND).valueOf() || true,
      introspection:
        new Boolean(process.env.GRAPHQL_PLAYGROUND).valueOf() || true,
      autoSchemaFile: "schema.gql",
      formatError: (error: GraphQLError) => {
        const exception = error?.extensions?.exception as any;
        const graphQLFormattedError: GraphQLFormattedError = {
          message: exception?.response?.message || error?.message,
        };
        return graphQLFormattedError;
      },
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    Auth0Module,
    AuthModule,
    AzureTelemetryModule,
    AzureStorageModule,
    HealthModule,
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
}
