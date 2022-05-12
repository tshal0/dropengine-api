import { Method } from "axios";
import { requestObject, AuthRequestOptions } from "./requestObject";
const HEADERS = { "content-type": "application/json" };
const POST = "POST";
const SCOPES = "token id_token openid profile email";

export async function loadAccessToken(
  tokenOptions: AuthPayloadParams
): Promise<string> {
  const payload = grantTypePayloads[tokenOptions.grantType](tokenOptions);
  const options = generateTokenRequestOptions(tokenOptions.url, payload);
  return await fetchAccessToken(options);
}
export async function fetchAccessToken(
  options: AuthRequestOptions
): Promise<string> {
  let resp = await requestObject(options);
  return resp.access_token;
}

export function generateTokenRequestOptions(
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
    method: POST as Method,
    url: accessTokenUrl,
    headers: HEADERS,
    body: payload,
    json: true,
  };
}
export interface AuthPayloadParams {
  clientId: any;
  clientSecret: any;
  audience: any;
  userName: any;
  userPass: any;
  grantType: any;
  url: string;
}
export const grantTypePayloads: { [key: string]: (params: any) => any } = {
  password: (params: AuthPayloadParams) => {
    if (!params.userName || !params.userPass) {
      throw new Error(`User not found for grantType: 'password'`);
    }
    return {
      client_id: params.clientId,
      client_secret: params.clientSecret,
      audience: params.audience,
      scope: SCOPES,
      username: params.userName,
      password: params.userPass,
      grant_type: params.grantType,
    };
  },
  client_credentials: (params: AuthPayloadParams) => {
    return {
      grant_type: params.grantType,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      audience: params.audience,
    };
  },
};
