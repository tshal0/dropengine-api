import { HttpModule, HttpService } from "@nestjs/axios";
import {
  Module,
  CacheModule,
  CACHE_MANAGER,
  OnModuleInit,
  Inject,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import {
  AzureTelemetryModule,
  AzureTelemetryService,
  WinstonLogger,
} from "@shared/modules";
import { requestObject } from "@shared/utils";
import https from "https";
import { Auth0MgmtApiClient } from "./Auth0MgmtApiClient";
import { Cache } from "cache-manager";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";

@Module({
  providers: [Auth0MgmtApiClient],
  exports: [Auth0MgmtApiClient],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    AzureTelemetryModule,
    WinstonModule,
    HttpModule.registerAsync({
      imports: [ConfigModule, CacheModule.register(), AzureTelemetryModule],
      useFactory: async (config: ConfigService, cache: Cache) => {
        const URL = config.get("AUTH0_MGMT_API_URL");
        const AUTH0_ACCESS_TOKEN_URL = config.get("AUTH0_ACCESS_TOKEN_URL");
        const AUTH0_MGMT_CLIENT_ID = config.get("AUTH0_MGMT_CLIENT_ID");
        const AUTH0_MGMT_CLIENT_SECRET = config.get("AUTH0_MGMT_CLIENT_SECRET");
        const AUTH0_MGMT_AUDIENCE = config.get("AUTH0_MGMT_AUDIENCE");
        const AUTH0_MGMT_GRANT_TYPE = config.get("AUTH0_MGMT_GRANT_TYPE");

        let TOKEN = await cache.get("AUTH0_MGMT_ACCESS_TOKEN");

        if (!TOKEN) {
          const options = {
            method: "POST",
            url: AUTH0_ACCESS_TOKEN_URL,
            headers: { "content-type": "application/json" },
            body: {
              client_id: AUTH0_MGMT_CLIENT_ID,
              client_secret: AUTH0_MGMT_CLIENT_SECRET,
              audience: AUTH0_MGMT_AUDIENCE,
              grant_type: AUTH0_MGMT_GRANT_TYPE,
            },
            json: true,
          };
          const resp = await requestObject(options);
          TOKEN = resp?.object?.access_token;
          cache.set("AUTH0_MGMT_ACCESS_TOKEN", TOKEN, { ttl: 3600 });
        }
        const httpConfig = {
          baseURL: URL,
          headers: { Authorization: `Bearer ${TOKEN}` },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),

          "axios-retry": {
            retryDelay: (retryCount) => retryCount * 1000,
          },
        };

        return httpConfig;
      },
      inject: [ConfigService, CACHE_MANAGER],
    }),
    ConfigModule,
    CacheModule.register(),
  ],
  controllers: [],
})
export class Auth0Module implements OnModuleInit {
  constructor(private readonly http: HttpService) {}

  public onModuleInit(): any {
    // Add request interceptor and response interceptor to log request infos
    const axios = this.http.axiosRef;

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
