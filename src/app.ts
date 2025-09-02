import Fastify, { FastifyServerOptions } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";

import route from "./route";

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
  // fastify.decorateReply("getTime", () => performance.now());
  fastify.decorateReply("getTime", () => Date.now());

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

  fastify.register(route);

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

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
