import Fastify from "fastify";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  const app = Fastify({
    logger: true,
  });

  app.get("/", async () => {
    return { ok: true, service: "backend", message: "Fastify + TypeScript" };
  });

  app.get("/health", async () => {
    return { status: "healthy" };
  });

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
