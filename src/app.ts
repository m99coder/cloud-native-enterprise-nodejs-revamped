import Fastify, { FastifyServerOptions } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";

import config, { DurationGranularity } from "./config";
import headersRoute from "./routes/headers";
import healthCheckRoute from "./routes/health";
import codesRoute from "./routes/codes";

// decorate FastifyReply
// see: https://fastify.dev/docs/v5.4.x/Reference/Decorators/
// see: https://fastify.dev/docs/latest/Reference/TypeScript/#plugins
declare module "fastify" {
  interface FastifyReply {
    startTime: number;
    getTime: () => number;
  }
}

const createServer = (opts: FastifyServerOptions = {}) => {
  const fastify = Fastify(opts);

  // add custom properties to keep track of timings
  fastify.decorateReply("startTime", 0);
  fastify.decorateReply("getTime", () =>
    config.server.durationGranularity === DurationGranularity.Default
      ? Date.now()
      : performance.now()
  );

  // custom logging using hooks
  fastify.addHook("onRequest", (req, res, done) => {
    // persist start time
    res.startTime = res.getTime();
    req.log.info({ url: req.raw.url }, "Received request");
    done();
  });

  fastify.addHook("onResponse", (req, res, done) => {
    req.log.info(
      {
        url: req.raw.url,
        statusCode: res.raw.statusCode,
        // calculate duration and log it
        durationMs: res.getTime() - res.startTime,
      },
      "Request completed"
    );
    done();
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(headersRoute);
  fastify.register(healthCheckRoute);
  fastify.register(codesRoute);

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      querystring: z.object({
        name: z.string().min(4),
      }),
      response: {
        200: z.string(),
      },
    },
    handler: (req, res) => {
      res.send(req.query.name);
    },
  });

  return fastify;
};

export default createServer;
