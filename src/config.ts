import env from "./env";

const HOST: string = env.HOST;
const PORT: number = env.PORT;

export enum DurationGranularity {
  Default = "default",
  High = "high",
}
type Config = {
  server: {
    host: string;
    port: number;
    durationGranularity: DurationGranularity;
  };
};

const config: Config = {
  server: {
    host: HOST,
    port: PORT,
    durationGranularity: DurationGranularity.Default,
  },
};

export default config;
