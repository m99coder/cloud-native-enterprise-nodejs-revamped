import { afterEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import build from "./app";

describe("routes", () => {
  const app = build();

  afterEach(() => {
    app.close();
  });

  test("requests the hello route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/hello",
    });
    assert.strictEqual(
      response.statusCode,
      200,
      "returns a status code of 200"
    );
  });
});
