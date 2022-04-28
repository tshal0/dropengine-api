import request from "request";
import safeJsonStringify from "safe-json-stringify";

export interface AuthRequestResponse {
  code: number;
  object: {
    access_token: string;
  };
}

export function requestObject(options): Promise<AuthRequestResponse> {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else if (200 > response.statusCode || 299 < response.statusCode) {
        reject(
          new Error(
            `Remote resource ${options.url} returned status code: ${
              response.statusCode
            }: ${safeJsonStringify(body, null, 2)} ${safeJsonStringify(
              options,
              null,
              2
            )}`
          )
        );
      } else {
        const object = typeof body === "string" ? JSON.parse(body) : body; // FIXME throws
        resolve({ code: response.statusCode, object });
      }
    });
  });
}
