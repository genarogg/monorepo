import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PORT = Number(process.env.PORT) || 4000;
const NEXT_PORT = Number(process.env.NEXT_PORT) || 3000;
const DOCS_PORT = Number(process.env.DOCS_PORT) || 4321;

async function main() {
  const app = Fastify();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.get("/api", async () => {
    return { ok: true, service: "backend", message: "Fastify + TypeScript" };
  });

  app.get("/api/health", async () => {
    return { status: "healthy" };
  });
  await app.register(httpProxy, {
    upstream: `http://localhost:${DOCS_PORT}`,
    prefix: "/docs",
  });

  await app.register(httpProxy, {
    upstream: `http://localhost:${NEXT_PORT}`,
  });

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`la app esta corriendo en el puerto http://localhost:${PORT}`)
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
