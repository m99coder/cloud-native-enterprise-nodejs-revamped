import { test } from "node:test";
import assert from "node:assert/strict";

test("synchronous passing test", (_t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});
