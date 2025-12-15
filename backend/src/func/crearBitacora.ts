import { prisma } from "@fn";
import { AccionesBitacora } from "@prisma";

interface CrearBitacoraArgs {
  usuarioId: number;
  accion: string;
  mensaje?: string;
  type: AccionesBitacora;
  ip?: string;
}

const crearBitacora = async ({
  usuarioId,
  accion,
  mensaje = "N/A",
  type,
  ip = "N/A",
}: CrearBitacoraArgs) => {
  try {
    const accionLimpia = accion.trim().toLowerCase();

    const bitacora = await prisma.bitacora.create({
      data: {
        usuarioId,
        accion: accionLimpia,
        ip,
        mensaje,
        type,
      },
    });
    return bitacora;
  } catch (error) {
    console.error("Error al crear la bitácora:", error);
    throw new Error("No se pudo crear la bitácora");
  }
};

export default crearBitacora;