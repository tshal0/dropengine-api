import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
