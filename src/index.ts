import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";
import env from "./env.ts";

const port: number = env.PORT;

interface IQueryString {
  username: string;
  password: string;
}

interface IHeaders {
  "h-custom": string;
}

interface IReply {
  200: { success: boolean; message: string };
  302: { url: string };
  "4xx": { error: string };
}

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.get("/ping", async (_request, _reply) => {
  return "pong\n";
});

server.get<{ Querystring: IQueryString; Headers: IHeaders; Reply: IReply }>(
  "/auth",
  {
    preValidation: (request, _reply, done) => {
      const { username } = request.query;
      done(username !== "admin" ? new Error("Must be admin") : undefined);
    },
  },
  async (request, reply) => {
    const { username, password } = request.query;
    const customHeader = request.headers["h-custom"];

    reply.code(200).send({
      success: true,
      message: `logged in as ${username} with a password of length ${password.length} and provided this custom header value: ${customHeader}`,
    });
    // reply.code(200).send("uh-oh");
    // reply.code(404).send({ error: "Not found" });
  }
);

server.withTypeProvider<ZodTypeProvider>().route({
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

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
