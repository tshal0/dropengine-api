import "module-alias/register";
import {
  VersioningType,
  VERSION_NEUTRAL,
  ValidationPipe,
  BadRequestException,
  RequestMethod,
} from "@nestjs/common";
import {
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from "nest-winston";

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ValidationError } from "class-validator";
import { ServerModule } from "./server.module";
import { Constants, Versions } from "./shared";
import * as appInsights from "applicationinsights";
import { initAppInsights, WinstonLogger } from "@shared/modules";
import { Logger } from "winston";
process.env.FORCE_COLOR = "true";

appInsights
  .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(true)
  .start();
async function bootstrap() {
  const app = await NestFactory.create(ServerModule, {
    logger: WinstonModule.createLogger(WinstonLogger.loggerOptions),
  });
  const wlog: WinstonLogger = await app.resolve(WINSTON_MODULE_PROVIDER);
  app.useLogger(wlog);
  const config = app.get<ConfigService>(ConfigService);
  const telemetry = await app.resolve<AzureTelemetryService>(
    AzureTelemetryService
  );
  const key = config.get<string>(Constants.APPINSIGHTS);
  telemetry.setClient(appInsights.defaultClient);

  wlog.debug(`${Constants.APPINSIGHTS}: ${key}`);
  wlog.debug(`ApplicationInsights Initialized!`);
  wlog.debug(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
  wlog.debug(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
  wlog.debug(`POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}`);
  wlog.debug(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
  wlog.debug(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
  wlog.debug(`POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);
  wlog.debug(`POSTGRES_SCHEMA: ${process.env.POSTGRES_SCHEMA}`);
  wlog.debug(`DATABASE_URL: ${process.env.DATABASE_URL}`);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: Versions.v1,
  });
  // app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: {
        target: false,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    })
  );
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "", method: RequestMethod.GET },
      { path: "/", method: RequestMethod.GET },
      { path: "/api/docs", method: RequestMethod.GET },
    ],
  });
  const docBuilder = new DocumentBuilder()
    .setTitle("DropEngine")
    .setDescription("The DropEngine API")
    .setVersion("1.0")
    .setBasePath("api")
    .build();
  const document = SwaggerModule.createDocument(app, docBuilder, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup("api/docs", app, document);

  const port = config.get("PORT");
  await app.listen(`${Number(port)}`);

  wlog.log(`Application is running on: ${await app.getUrl()}`);

  app.enableCors();
}
bootstrap();
