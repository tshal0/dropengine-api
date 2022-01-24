import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class AzureLoggerService extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super();
  }

  error(message: string, stack?: string, context?: any) {
    // add your tailored logic here

    super.error.apply(this, arguments);
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log.apply(this, arguments);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn.apply(this, arguments);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    super.debug.apply(this, arguments);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose.apply(this, arguments);
  }
}
