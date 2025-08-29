import { FastifyInstance } from "fastify";

const route = async (fastify: FastifyInstance) => {
  fastify.get("/hello", async () => {
    return { hello: "world" };
  });
};

export default route;
