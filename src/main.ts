import 'module-alias/register';
import {
  VersioningType,
  VERSION_NEUTRAL,
  ValidationPipe,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ValidationError } from "class-validator";
import { ServerModule } from "./server.module";
async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.enableCors();

  const config_service = app.get<ConfigService>(ConfigService);

  app.useLogger(await app.resolve(AzureLoggerService));
  const logger = await app.resolve<AzureLoggerService>(AzureLoggerService);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
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
  SwaggerModule.setup("swagger", app, document);

  const port = config_service.get("PORT");
  await app.listen(`${Number(port)}`);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
