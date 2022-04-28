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
import { AzureTelemetryModule, AzureTelemetryService } from "@shared/modules";
import { requestObject } from "@shared/utils";
import https from "https";
import { Cache } from "cache-manager";
import { MyEasySuiteClient } from "./MyEasySuiteClient";
import { MyEasySuiteController } from "./api/MyEasySuiteController";

export abstract class MES {
  static readonly MES_API_URL: string = `MES_API_URL`;

  static readonly MES_AUTH0_ACCESS_TOKEN_URL: string = `MES_AUTH0_ACCESS_TOKEN_URL`;
  static readonly MES_AUTH0_CLIENT_ID: string = `MES_AUTH0_CLIENT_ID`;
  static readonly MES_AUTH0_CLIENT_SECRET: string = `MES_AUTH0_CLIENT_SECRET`;
  static readonly MES_AUTH0_AUDIENCE: string = `MES_AUTH0_AUDIENCE`;
  static readonly MES_AUTH0_GRANT_TYPE: string = `MES_AUTH0_GRANT_TYPE`;
  static readonly MES_AUTH0_ACCESS_TOKEN: string = `MES_AUTH0_ACCESS_TOKEN`;

  static readonly MES_AUTH0_USERNAME: string = `MES_AUTH0_USERNAME`;
  static readonly MES_AUTH0_PASSWORD: string = `MES_AUTH0_PASSWORD`;
  static readonly HEADERS = { "content-type": "application/json" };
  static readonly POST = "POST";
  static readonly SCOPES = "token id_token openid profile email";
  static readonly META: string = "metadata";
  static readonly v20211014 = "v2021-10-14";
}

@Module({
  providers: [MyEasySuiteClient],
  exports: [MyEasySuiteClient],
  controllers: [MyEasySuiteController],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule.registerAsync({
      imports: [ConfigModule, CacheModule.register()],
      useFactory: async (config: ConfigService, cache: Cache) => {
        const baseUrl = config.get(MES.MES_API_URL);
        const accessTokenUrl = config.get(MES.MES_AUTH0_ACCESS_TOKEN_URL);
        const clientId = config.get(MES.MES_AUTH0_CLIENT_ID);
        const clientSecret = config.get(MES.MES_AUTH0_CLIENT_SECRET);
        const audience = config.get(MES.MES_AUTH0_AUDIENCE);
        const grantType = config.get(MES.MES_AUTH0_GRANT_TYPE);
        const userName = config.get(MES.MES_AUTH0_USERNAME);
        const userPass = config.get(MES.MES_AUTH0_PASSWORD);

        let accessToken = await cache.get(MES.MES_AUTH0_ACCESS_TOKEN);

        if (!accessToken) {
          const payload = generateTokenRequestPayload(
            clientId,
            clientSecret,
            audience,
            userName,
            userPass,
            grantType
          );
          const options = generateTokenRequestOptions(accessTokenUrl, payload);
          try {
            accessToken = await loadAccessToken(options, accessToken);
            const isMock = accessToken == "MOCK_ACCESS_TOKEN";
            cache.set(MES.MES_AUTH0_ACCESS_TOKEN, accessToken, { ttl: 3600 });
            // console.debug(
            //   `New MyEasySuite Access Token Acquired: ${
            //     isMock ? accessToken : accessToken?.length
            //   }`
            // );
          } catch (error) {
            accessToken = "TOKEN_FAILED_TO_LOAD";
            cache.set(MES.MES_AUTH0_ACCESS_TOKEN, accessToken, {
              ttl: 3600,
            });
            console.error(`New MyEasySuite Access Token Failed To Load.`);
          }
        }
        const myEasySuiteHeaders = {
          Authorization: `Bearer ${accessToken}`,
          "myeasysuite-orders-version": MES.v20211014,
        };
        const myEasySuiteHttpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
        const retryConfig = {
          retryDelay: (retryCount) => retryCount * 1000,
        };
        const httpConfig = {
          baseURL: baseUrl,
          headers: myEasySuiteHeaders,
          httpsAgent: myEasySuiteHttpsAgent,

          "axios-retry": retryConfig,
        };

        return httpConfig;
      },
      inject: [ConfigService, CACHE_MANAGER],
    }),
    ConfigModule,
    CacheModule.register(),
  ],
})
export class MyEasySuiteModule implements OnModuleInit {
  constructor(private readonly http: HttpService) {}

  public onModuleInit(): any {
    // Add request interceptor and response interceptor to log request infos
    const axios = this.http.axiosRef;

    axios.interceptors.request.use(function (config) {
      config[MES.META] = { ...config[MES.META], startDate: new Date() };
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config[MES.META] = { ...config[MES.META], endDate: new Date() };
        const duration =
          config[MES.META].endDate.getTime() -
          config[MES.META].startDate.getTime();

        const durationLog = this.generateDurationLog(config, duration);
        console.log(durationLog);

        return response;
      },
      (err) => {
        console.error(err);
        // Don't forget this line like I did at first: it makes your failed HTTP requests resolve with "undefined" :-(
        return Promise.reject(err);
      }
    );
  }

  private generateDurationLog(config, duration: number) {
    return `${config.method.toUpperCase()} ${config.url} ${duration}ms`;
  }
}
async function loadAccessToken(
  options: {
    method: string;
    url: any;
    headers: { "content-type": string };
    body: {
      client_id: any;
      client_secret: any;
      audience: any;
      scope: string;
      username: any;
      password: any;
      grant_type: any;
    };
    json: boolean;
  },
  accessToken: any
) {
  const resp = await requestObject(options);

  accessToken = extractAccessToken(resp);
  return accessToken;
}

function extractAccessToken(resp: {
  code: number;
  object: { access_token: string };
}): any {
  return resp?.object?.access_token;
}

function generateTokenRequestOptions(
  accessTokenUrl: any,
  payload: {
    client_id: any;
    client_secret: any;
    audience: any;
    scope: string;
    username: any;
    password: any;
    grant_type: any;
  }
) {
  return {
    method: MES.POST,
    url: accessTokenUrl,
    headers: MES.HEADERS,
    body: payload,
    json: true,
  };
}

function generateTokenRequestPayload(
  clientId: any,
  clientSecret: any,
  audience: any,
  userName: any,
  userPass: any,
  grantType: any
) {
  return {
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    scope: MES.SCOPES,
    username: userName,
    password: userPass,
    grant_type: grantType,
  };
}
