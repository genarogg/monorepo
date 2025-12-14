import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";

const PORT = Number(process.env.PORT) || 4000;
const NEXT_PORT = Number(process.env.NEXT_PORT) || 3000;
const DOCS_PORT = Number(process.env.DOCS_PORT) || 4321;

async function main() {
  const app = Fastify({ logger: true });

  app.get("/api", async () => {
    return { ok: true, service: "backend", message: "Fastify + TypeScript" };
  });

  app.get("/api/health", async () => {
    return { status: "healthy" };
  });

  await app.register(httpProxy, {
    upstream: `http://127.0.0.1:${DOCS_PORT}`,
    prefix: "/docs",
  });

  await app.register(httpProxy, {
    upstream: `http://127.0.0.1:${NEXT_PORT}`,
  });

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
