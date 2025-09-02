import { FastifyInstance } from "fastify";

const route = async (fastify: FastifyInstance) => {
  fastify.get("/health", (_req, res) => {
    res.code(200).send();
  });
};

export default route;
