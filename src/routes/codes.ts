import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const route = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/codes",
    schema: {
      querystring: z.object({
        code: z.coerce.number().int().positive().gt(100).lt(600),
      }),
    },
    handler: (req, res) => {
      res.status(req.query.code).send();
    },
  });
};

export default route;
