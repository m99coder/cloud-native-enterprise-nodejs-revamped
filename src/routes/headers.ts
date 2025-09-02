import { FastifyInstance } from "fastify";

const route = async (fastify: FastifyInstance) => {
  fastify.get("/headers", (req, res) => {
    req.log.info(
      { headers: req.headers },
      "Logging request headers for debugging …"
    );
    res.code(200).send();
  });
};

export default route;
