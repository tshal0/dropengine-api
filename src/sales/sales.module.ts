import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule, AzureStorageModule } from "@shared/modules";
import { OrdersController } from "./api/OrdersController";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule,
    AzureLoggerModule,
    ConfigModule,
    CacheModule.register(),
    AzureStorageModule,
  ],
  controllers: [OrdersController],
})
export class SalesModule {}
