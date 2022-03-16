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
import { AzureLoggerModule, AzureLoggerService } from "@shared/modules";
import { requestObject } from "@shared/utils";
import https from "https";
import { Auth0MgmtApiClient } from "./auth0-mgmt-api.service";
import { HandleUserSignedUpUseCase } from "./useCases/HandleUserSignedUp";
import { Cache } from "cache-manager";

@Module({
  providers: [Auth0MgmtApiClient, HandleUserSignedUpUseCase],
  exports: [Auth0MgmtApiClient],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule.registerAsync({
      imports: [ConfigModule, CacheModule.register()],
      useFactory: async (config: ConfigService, cache: Cache) => {
        const URL = config.get("AUTH0_MGMT_API_URL");
        const AUTH0_ACCESS_TOKEN_URL = config.get("AUTH0_ACCESS_TOKEN_URL");
        const AUTH0_MGMT_CLIENT_ID = config.get("AUTH0_MGMT_CLIENT_ID");
        const AUTH0_MGMT_CLIENT_SECRET = config.get("AUTH0_MGMT_CLIENT_SECRET");
        const AUTH0_MGMT_AUDIENCE = config.get("AUTH0_MGMT_AUDIENCE");
        const AUTH0_MGMT_GRANT_TYPE = config.get("AUTH0_MGMT_GRANT_TYPE");
        const ENVIRONMENT = config.get("ENVIRONMENT");
        console.log(AUTH0_ACCESS_TOKEN_URL);
        console.log(AUTH0_MGMT_CLIENT_ID);
        console.log(AUTH0_MGMT_CLIENT_SECRET);
        console.log(AUTH0_MGMT_AUDIENCE);
        console.log(AUTH0_MGMT_GRANT_TYPE);
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
          console.log(
            `NEW AUTH0_MGMT_ACCESS_TOKEN: ${resp?.object?.access_token}`
          );
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
    AzureLoggerModule,
  ],
  controllers: [],
})
export class Auth0Module implements OnModuleInit {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly logger: AzureLoggerService,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}

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
        this.logger.log(
          `${config.method.toUpperCase()} ${config.url} ${duration}ms`
        );

        return response;
      },
      (err) => {
        this.logger.error(err);
        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      }
    );
  }
}
