import "module-alias/register";
import {
  VersioningType,
  VERSION_NEUTRAL,
  ValidationPipe,
  BadRequestException,
  RequestMethod,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ValidationError } from "class-validator";
import { ServerModule } from "./server.module";
import { Versions } from "./shared";
async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.enableCors();

  const config_service = app.get<ConfigService>(ConfigService);

  app.useLogger(await app.resolve(AzureLoggerService));

  const logger = await app.resolve<AzureLoggerService>(AzureLoggerService);
  logger.debug(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
  logger.debug(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
  logger.debug(`POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}`);
  logger.debug(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
  logger.debug(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
  logger.debug(`POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);
  logger.debug(`POSTGRES_SCHEMA: ${process.env.POSTGRES_SCHEMA}`);
  logger.debug(`DATABASE_URL: ${process.env.DATABASE_URL}`);

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

  const config = new DocumentBuilder()
    .setTitle("DropEngine")
    .setDescription("The DropEngine API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup("api/docs", app, document);
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "", method: RequestMethod.GET },
      { path: "/", method: RequestMethod.GET },
      { path: "/api/docs", method: RequestMethod.GET },
    ],
  });
  const port = config_service.get("PORT");
  await app.listen(`${Number(port)}`);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
