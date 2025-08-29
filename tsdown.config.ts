import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/server.ts"],
  platform: "neutral",
  dts: {
    oxc: true,
  },
});
