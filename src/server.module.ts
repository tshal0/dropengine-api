import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { AzureLoggerModule } from "@shared/modules/azure-logger/azure-logger.module";
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
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
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
    AzureLoggerModule,
    AzureStorageModule,
    CacheModule.register(),
    // PrismaModule,
    AppModule,
    Auth0Module,
    AccountsModule,
    ShopifyModule,
    CatalogModule,
    SalesModule,
  ],
})
export class ServerModule {}
