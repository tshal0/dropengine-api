import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureStorageModule, AzureTelemetryModule } from "@shared/modules";
import { PreviewController } from "./preview.controller";
import { PreviewService } from "./preview.service";

@Module({
  controllers: [PreviewController],
  providers: [PreviewService],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule,
    AzureTelemetryModule,
    ConfigModule,
    CacheModule.register(),
    AzureStorageModule,
  ],
})
export class PreviewModule {}
