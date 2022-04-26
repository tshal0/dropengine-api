import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { AzureTelemetryService } from "@shared/modules";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AzureTelemetryService) {
    super();
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof BadRequestException) {
    }
    if (exception instanceof InternalServerErrorException) {
    }

    super.catch(exception, host);
  }
}
