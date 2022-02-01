import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AzureLoggerModule } from '../azure-logger/azure-logger.module';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [AzureLoggerModule],
})
export class PrismaModule {}
