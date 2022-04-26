import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import {
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from "nest-winston";
import winston from "winston/lib/winston/config";
import { winstonLoggerOptions } from "../winston-logger/winstonLogger";

import authConfig from "./auth.config";

import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {
  public onModuleInit(): any {}
}
