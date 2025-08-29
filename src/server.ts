import createServer from "./app";
import env from "./env";

const HOST: string = env.HOST;
const PORT: number = env.PORT;

const start = async () => {
  const fastify = createServer({
    logger: {
      level: "info",
    },
  });

  try {
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
