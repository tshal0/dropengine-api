import { HttpModule, HttpService } from "@nestjs/axios";
import {
  Module,
  CacheModule,
  CACHE_MANAGER,
  OnModuleInit,
  Inject,
  Logger,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import {
  AzureTelemetryModule,
  AzureTelemetryService,
  WinstonLogger,
} from "@shared/modules";
import {
  AuthPayloadParams,
  generateTokenRequestOptions,
  grantTypePayloads,
  loadAccessToken,
  requestObject,
} from "@shared/utils";
import https from "https";
import { Auth0MgmtApiClient } from "./Auth0MgmtApiClient";
import { Cache } from "cache-manager";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import safeJsonStringify from "safe-json-stringify";
import { MES } from "@myeasysuite/MyEasySuiteModule";
export abstract class AUTH0 {
  static readonly AUTH0_MGMT_API_URL: string = `AUTH0_MGMT_API_URL`;

  static readonly AUTH0_MGMT_ACCESS_TOKEN_URL: string = `AUTH0_MGMT_ACCESS_TOKEN_URL`;
  static readonly AUTH0_MGMT_CLIENT_ID: string = `AUTH0_MGMT_CLIENT_ID`;
  static readonly AUTH0_MGMT_CLIENT_SECRET: string = `AUTH0_MGMT_CLIENT_SECRET`;
  static readonly AUTH0_MGMT_AUDIENCE: string = `AUTH0_MGMT_AUDIENCE`;
  static readonly AUTH0_MGMT_GRANT_TYPE: string = `AUTH0_MGMT_GRANT_TYPE`;
  static readonly AUTH0_MGMT_ACCESS_TOKEN: string = `AUTH0_MGMT_ACCESS_TOKEN`;
  static readonly AUTH0_MGMT_USERNAME: string = `AUTH0_MGMT_USERNAME`;
  static readonly AUTH0_MGMT_PASSWORD: string = `AUTH0_MGMT_PASSWORD`;

  static readonly META: string = "metadata";
}
@Module({
  providers: [Auth0MgmtApiClient],
  exports: [Auth0MgmtApiClient],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    AzureTelemetryModule,
    WinstonModule,
    HttpModule.registerAsync({
      imports: [ConfigModule, CacheModule.register()],
      useFactory: async (config: ConfigService, cache: Cache) => {
        const baseUrl = config.get(AUTH0.AUTH0_MGMT_API_URL);
        const accessTokenUrl = config.get(AUTH0.AUTH0_MGMT_ACCESS_TOKEN_URL);
        const clientId = config.get(AUTH0.AUTH0_MGMT_CLIENT_ID);
        const clientSecret = config.get(AUTH0.AUTH0_MGMT_CLIENT_SECRET);
        const audience = config.get(AUTH0.AUTH0_MGMT_AUDIENCE);
        const grantType = config.get(AUTH0.AUTH0_MGMT_GRANT_TYPE);
        const userName = config.get(AUTH0.AUTH0_MGMT_USERNAME);
        const userPass = config.get(AUTH0.AUTH0_MGMT_PASSWORD);

        let accessToken = await cache.get(AUTH0.AUTH0_MGMT_ACCESS_TOKEN);

        if (!accessToken) {
          const tokenOptions: AuthPayloadParams = {
            clientId,
            clientSecret,
            audience,
            userName,
            userPass,
            grantType,
            url: accessTokenUrl,
          };

          try {
            accessToken = await loadAccessToken(tokenOptions);
            console.log(
              `New Auth0ManagementAPI Token Received: ${accessToken?.length}`
            );
            cache.set(AUTH0.AUTH0_MGMT_ACCESS_TOKEN, accessToken, {
              ttl: 3600,
            });
          } catch (error) {
            accessToken = "TOKEN_FAILED_TO_LOAD";
            cache.set(AUTH0.AUTH0_MGMT_ACCESS_TOKEN, accessToken, {
              ttl: 3600,
            });
            console.error(
              `New Auth0ManagementAPI Access Token Failed To Load.`,
              error
            );
          }
        }
        const auth0MgmtHeaders = {
          Authorization: `Bearer ${accessToken}`,
        };
        const auth0MgmtHttpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
        const retryConfig = {
          // retryDelay: (retryCount) => retryCount * 1000,
        };
        const httpConfig = {
          baseURL: baseUrl,
          headers: auth0MgmtHeaders,
          httpsAgent: auth0MgmtHttpsAgent,

          "axios-retry": retryConfig,
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
  private readonly logger: Logger = new Logger(Auth0Module.name);
  constructor(private readonly http: HttpService) {}

  public onModuleInit(): any {
    // Add request interceptor and response interceptor to log request infos
    const axios = this.http.axiosRef;
    const logger = this.logger;
    axios.interceptors.request.use(function (config) {
      logger.log(`AUTH0 REQUEST: ${config.baseURL}${config.url}`);

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
