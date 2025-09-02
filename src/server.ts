// import EventEmitter from "events";
import createServer from "./app";
import env from "./env";

const HOST: string = env.HOST;
const PORT: number = env.PORT;

const start = async () => {
  const fastify = createServer({
    logger: {
      level: "info",
    },
    // generate request id as UUIDv4 using built-in crypto module
    genReqId: () => crypto.randomUUID(),
  });

  // SIGNALS ---

  // begin reading from stdin so the process does not exit
  process.stdin.resume();

  const shutdown = (signal: string) => {
    fastify.log.info(`Received ${signal}`);
    fastify.close();
    process.exit(0);
  };

  // process is killed with CTRL+C
  process.on("SIGINT", shutdown);

  // process is killed with SIGTERM (`kill <pid>`, `docker stop`)
  process.on("SIGTERM", shutdown);

  process.on("exit", (code: number) => {
    const logMethod = code === 0 ? "info" : "error";
    fastify.log[logMethod]({ code }, `Exit with code ${code}`);
  });

  // EXCEPTIONS ---

  const crash = (err: Error | unknown, msg: string) => {
    fastify.log.error({ err }, msg);
    process.exit(1);
  };

  // log any uncaught exception and exit in a controlled way
  process.on("uncaughtException", (err: Error) => {
    crash(err, "Uncaught exception has occured");
  });

  // log any unhandled rejection and exit in a controlled way
  process.on("unhandledRejection", (err: unknown) => {
    crash(err, "Unhandled rejected has occured");
  });

  // START ---

  try {
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    throw err;
  }

  // SIMULATE ---

  // provoke uncaught exception
  // throw new Error("Provoke uncaught exception");

  // new EventEmitter().emit(
  //   "error",
  //   new Error("Provoke uncaught EventEmitter error")
  // );

  // provoke unhandled exception
  // Promise.reject(new Error("Provoke unhandled rejection"));
};

start();
