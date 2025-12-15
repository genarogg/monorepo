import Fastify from "fastify";

import { fileURLToPath } from "node:url";
import path from "node:path";
import { proxy } from "./src/config"

const PORT = Number(process.env.PORT) || 4000;



async function main() {
  const app = Fastify();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);


  await proxy(app);

  app.get("/api", async () => {
    return { ok: true, service: "backend", message: "Fastify + TypeScript" };
  });

  app.get("/api/health", async () => {
    return { status: "healthy" };
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
