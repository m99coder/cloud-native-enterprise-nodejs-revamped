import { afterEach, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";
import { FastifyInstance } from "fastify";

import build from "./app";

describe("routes", () => {
  const app = build();

  test("requests the specific routes successfully", async () => {
    const routes = ["/health", "/headers"];

    for (let route of routes) {
      const response = await app.inject({
        method: "GET",
        url: route,
      });

      assert.strictEqual(
        response.statusCode,
        200,
        "returns a status code of 200"
      );
      assert.strictEqual(response.body, "", "returns an empty body");
    }
  });

  test("returns the codes route with the specified response code", async () => {
    const codes = [201, 304, 400, 500];

    for (let code of codes) {
      const response = await app.inject({
        method: "GET",
        url: "/codes",
        query: `code=${code}`,
      });

      assert.strictEqual(
        response.statusCode,
        code,
        `returns a status code of ${code}`
      );
    }
  });
});
