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
import { UsersModule } from "./users/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PassportModule } from "@nestjs/passport";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CatalogModule } from "./catalog/catalog.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    MikroOrmModule.forRoot({
      entities: ["./dist/**/entities/*.entity.js"],
      entitiesTs: ["./src/**/entities/*.entity.ts"],
      clientUrl: process.env.DATABASE_URL || undefined,
      driverOptions: {
        connection: { ssl: process.env.POSTGRES_SSL || true },
      },
      debug: true,
      // dbName: process.env.POSTGRES_DB || "dropengine",
      // host: process.env.POSTGRES_HOST,
      // port: parseInt(process.env.POSTGRES_PORT) || 5432,
      // user: process.env.POSTGRES_USER || "postgres",
      // password: process.env.POSTGRES_PASSWORD || "password",
      // schema: process.env.POSTGRES_SCHEMA || "public",
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
    UsersModule,
    ShopifyModule,
    CatalogModule,
  ],
})
export class ServerModule {}
