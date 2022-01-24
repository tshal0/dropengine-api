import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpService, HttpModule as BaseHttpModule } from '@nestjs/axios';
import { AzureLoggerService } from '../azure-logger/azure-logger.service';
import { AzureLoggerModule } from '../azure-logger/azure-logger.module';

@Module({
  imports: [
    AzureLoggerModule,
    // I prefer temporarily aliasing the homonymous module rather than naming my module MyHttpModule
    BaseHttpModule,
  ],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AzureLoggerService,
  ) {}

  public onModuleInit(): any {

    // Add request interceptor and response interceptor to log request infos
    const axios = this.httpService.axiosRef;
    axios.interceptors.request.use(function (config) {
      // Please don't tell my Typescript compiler...
      config['metadata'] = { ...config['metadata'], startDate: new Date() };
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };
        const duration =
          config['metadata'].endDate.getTime() -
          config['metadata'].startDate.getTime();

        // Log some request infos (you can actually extract a lot more if you want: the content type, the content size, etc.)
        this.logger.log(
          `${config.method.toUpperCase()} ${config.url} ${duration}ms`,
        );

        return response;
      },
      (err) => {
        this.logger.error(err);
        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      },
    );
   
  }
}
