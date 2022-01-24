import { Module } from '@nestjs/common';
import { AzureLoggerService } from './azure-logger.service';

@Module({
  providers: [AzureLoggerService],
  exports: [AzureLoggerService],
})
export class AzureLoggerModule {}
