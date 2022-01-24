import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { AzureLoggerModule } from "@shared/modules/azure-logger/azure-logger.module";
import { AzureStorageModule } from "@shared/modules/azure-storage/azure-storage.module";
import { PrismaModule } from "@shared/modules/prisma/prisma.module";
import { AuthModule } from "@shared/modules/auth/auth.module";
import { AppModule } from "./app/app.module";
import { ShopifyModule } from "./shopify/shopify.module";
import { UsersModule } from "./users/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../", "client/dist"),
      exclude: ["/api*", "/shopify*", "*.js"],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_CONNECTION_STRING"),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ShopifyModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule,
    AzureLoggerModule,
    AzureStorageModule,
    CacheModule.register(),
    PrismaModule,
    AppModule,
    UsersModule,
    ShopifyModule,
  ],
})
export class ServerModule {}
