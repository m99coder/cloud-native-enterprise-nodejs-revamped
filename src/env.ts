import dotenvx from "@dotenvx/dotenvx";
import { z } from "zod";

dotenvx.config();

const schema = z.object({
  HOST: z.ipv4().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.log("Invalid .env", parsed.error.message);
  process.exit(1);
}

export default parsed.data;
