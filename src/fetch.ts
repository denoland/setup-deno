import * as console from "node:console";
import { setTimeout } from "node:timers";
import * as hc from "@actions/http-client";

/**
 * A fetch-compatible wrapper for @actions/http-client that maintains
 * the exact signature and behavior of the original src/version.ts function.
 */
export async function fetchWithRetries(url: string, maxRetries = 5) {
  const client = new hc.HttpClient();
  let sleepMs = 250;
  let iterationCount = 0;

  while (true) {
    iterationCount++;
    try {
      const res = await client.get(url);

      const fetchStyleResponse = {
        status: res.message.statusCode ?? 0,
        statusText: res.message.statusMessage ?? "",
        ok: (res.message.statusCode ?? 0) >= 200 &&
          (res.message.statusCode ?? 0) < 300,
        url,
        // Internal keys to persist data for multiple downstream calls
        _rawBody: await res.readBody(),
        _cachedJson: undefined as unknown,
        headers: {
          get: (name: string) =>
            res.message.headers[name.toLowerCase()]?.toString() ?? null,
          has: (name: string) => name.toLowerCase() in res.message.headers,
          entries: () =>
            Object.entries(res.message.headers).map(([k, v]) => [k, String(v)]),
        },
        text() {
          return Promise.resolve(this._rawBody);
        },
        json() {
          if (this._cachedJson === undefined) {
            this._cachedJson = JSON.parse(this._rawBody);
          }
          return Promise.resolve(this._cachedJson);
        },
      };

      // Original retry logic: succeed on 200 or stop after maxRetries
      if (fetchStyleResponse.status === 200 || iterationCount > maxRetries) {
        return fetchStyleResponse;
      }
    } catch (err) {
      if (iterationCount > maxRetries) {
        throw err;
      }
    }

    console.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, sleepMs));

    // Exponential backoff capped at 10 seconds
    sleepMs = Math.min(sleepMs * 2, 10_000);
  }
}
