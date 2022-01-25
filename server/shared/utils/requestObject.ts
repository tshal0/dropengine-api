import * as request from "request";

export function requestObject(
  options
): Promise<{ code: number; object: { access_token: string } }> {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      // console.log({ error, response, body });
      if (error) {
        reject(error);
      } else if (200 > response.statusCode || 299 < response.statusCode) {
        reject(
          new Error(
            `Remote resource ${options.url} returned status code: ${
              response.statusCode
            }: ${JSON.stringify(body)}`
          )
        );
      } else {
        const object = typeof body === "string" ? JSON.parse(body) : body; // FIXME throws
        resolve({ code: response.statusCode, object });
      }
    });
  });
}
