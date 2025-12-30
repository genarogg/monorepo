import Fastify, { FastifyInstance } from 'fastify'
import Table from 'cli-table3';
import clear from "console-clear";
import colors from "colors";
import 'dotenv/config';

const { SERVER_PORT } = process.env;
const server: FastifyInstance = Fastify()

import {
  dbConection,
  staticFiles,
  caching,
  helmet,
  rateLimit,
  underPressureFastify,
  corsFastify,
  compressFastify,
  // proxy,
  multipart,
  graphql,
  // viewEJS,
} from "./src/config"

const registerPlugins = async () => {


  // Plugins de rendimiento (en producción)
  if (process.env.NODE_ENV === "production") {

    await underPressureFastify(server);
    await caching(server);
    await rateLimit(server);
  }

  // Plugins de configuración básica primero
  // await viewEJS(server);
  await helmet(server);
  await corsFastify(server);
  await compressFastify(server);

  // Plugins de parsing
  await multipart(server);

  // Plugins de vista y archivos estáticos
  await staticFiles(server);
  // await proxy(server);
  // Plugins de funcionalidad
  await graphql(server);

}

import tack from "@/tasks"
import router from '@/routers';

(async () => {
  clear();
  try {
    await registerPlugins()
    server.register(router, { prefix: '/api' })
    const port = Number(SERVER_PORT) || 3500
    const dbStatus = await dbConection() || "";
    await server.listen({ port, host: '0.0.0.0' });

    const table = new Table({
      head: ['Servicio', 'URL'],
      colWidths: [20, 50]
    });

    /* ejecutar tareas programadas */
    tack()

    table.push(
      ['Servidor', colors.green(`http://localhost:${port}`)],
      ['Graphql', colors.green(`http://localhost:${port}/graphql`)],
      ["Rest API", colors.green(`http://localhost:${port}/api`)],
      ['Documentacion', colors.cyan(`http://localhost:${port}/docs`)],
      ["db estatus", colors.cyan(dbStatus)]
    );

    console.log(table.toString());
  } catch (err) {
    console.log(err)
  }
})();

export default server;