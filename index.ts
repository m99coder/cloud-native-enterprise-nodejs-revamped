import fastify from "fastify";

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

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get<{ Querystring: IQueryString; Headers: IHeaders; Reply: IReply }>(
  "/auth",
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

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
