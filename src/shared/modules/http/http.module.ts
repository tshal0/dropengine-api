import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { HttpService, HttpModule as BaseHttpModule } from "@nestjs/axios";
import { AzureTelemetryService } from "../azure-telemetry/azure-telemetry.service";
import { AzureTelemetryModule } from "../azure-telemetry/azure-telemetry.module";
import { WinstonLogger } from "../winston-logger";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Module({
  imports: [
    // I prefer temporarily aliasing the homonymous module rather than naming my module MyHttpModule
    BaseHttpModule,
  ],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): any {
    // Add request interceptor and response interceptor to log request infos
    const axios = this.httpService.axiosRef;
    axios.interceptors.request.use(function (config) {
      // Please don't tell my Typescript compiler...
      config["metadata"] = { ...config["metadata"], startDate: new Date() };
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config["metadata"] = { ...config["metadata"], endDate: new Date() };
        const duration =
          config["metadata"].endDate.getTime() -
          config["metadata"].startDate.getTime();

        // Log some request infos (you can actually extract a lot more if you want: the content type, the content size, etc.)

        return response;
      },
      (err) => {
        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      }
    );
  }
}
