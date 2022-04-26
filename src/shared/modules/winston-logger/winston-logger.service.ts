import { Injectable, Logger, LoggerService, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import winston from "winston";
import { winstonLoggerOptions } from "./winstonLogger";

@Injectable({ scope: Scope.DEFAULT })
export class WinstonLogger {
  private readonly logger: winston.Logger;
  public static loggerOptions: winston.LoggerOptions = winstonLoggerOptions;
  constructor() {
    this.logger = winston.createLogger(WinstonLogger.loggerOptions);
  }
  protected _context?: string = "Default";
  public set context(c: string) {
    this._context = c;
  }
  public get context() {
    return this._context;
  }
  error(message: string, stack?: string, ...optionalParams: any[]) {
    this.logger.error(message, {
      stack,
      context: this._context,
      ...optionalParams,
    });
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, {
      context: this._context,
      ...optionalParams,
    });
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, {
      context: this._context,
      ...optionalParams,
    });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, {
      context: this._context,
      ...optionalParams,
    });
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, {
      context: this._context,
      ...optionalParams,
    });
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, {
      context: this._context,
      ...optionalParams,
    });
  }
}
