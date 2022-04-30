import safeJsonStringify from "safe-json-stringify";
import axios, { Method } from "axios";
export interface AuthRequestResponse {
  code: number;
  body: {
    access_token: string;
  };
}
export interface AuthRequestOptions {
  method: Method;
  url: any;
  headers: {
    "content-type": string;
  };
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
}
export async function requestObject(options: AuthRequestOptions): Promise<any> {
  return await axios(options.url, {
    method: options.method,
    data: options.body,
    headers: options.headers,
  })
    .then((resp) => {
      const object =
        typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data; // FIXME throws
      return object;
    })
    .catch((err) => {
      throw new Error(
        `Remote resource ${options.url} returned status code: ${
          err.statusCode
        }: ${safeJsonStringify(err, null, 2)} ${safeJsonStringify(
          options,
          null,
          2
        )}`
      );
    })
    .finally(() => {});
}
