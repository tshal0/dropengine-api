import axios from "axios";

export async function loadAccessToken() {
  const options = generateTokenRequestOptions();
  const resp = await postAuth(options);

  const accessToken = extractAccessToken(resp);
  return accessToken;
}
export function extractAccessToken(resp: {
  code: number;
  object: { access_token: string };
}): any {
  return resp?.object?.access_token;
}
export function generateTokenRequestOptions() {
  const accessTokenUrl = process.env.AUTH0_ACCESS_TOKEN_URL;

  const payload = generateTokenRequestPayload();
  return {
    method: "POST",
    url: accessTokenUrl,
    headers: { "content-type": "application/json" },
    body: payload,
    json: true,
  };
}
function generateTokenRequestPayload() {
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_API_AUDIENCE;
  const grantType = process.env.AUTH0_GRANT_TYPE;
  const userName = process.env.AUTH0_USERNAME;
  const userPass = process.env.AUTH0_PASSWORD;
  return {
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    scope: "token id_token openid profile email",
    username: userName,
    password: userPass,
    grant_type: grantType,
  };
}

export interface AuthRequestResponse {
  code: number;
  object: {
    access_token: string;
  };
}
export async function postAuth(options): Promise<AuthRequestResponse> {
  let resp = await axios({
    url: options.url,
    data: options.body,
    headers: options.headers,
    method: options.method,
  })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
  return { code: resp.status, object: resp.data };
}
