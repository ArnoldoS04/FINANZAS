import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Inserta nuevo egreso
export const saveEgreso = async (req, res) => {
  const { id_subc, description, date_out, amount, auto } = req.body;
  const id_usr = req.user.id; // Obtener ID del usuario desde el token

  try {
    const egreso = await prisma.EGRESOS.create({
      data: {
        id_subc: parseInt(id_subc),
        id_usr: parseInt(id_usr),
        description,
        date_out: new Date(date_out),
        amount: parseFloat(amount),
        auto,
      },
    });

    res.status(201).json({ message: "Egreso creado exitosamente" });
  } catch (error) {
    console.log("Error al insertar egreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene todos los egresos
export const getEgresos = async (req, res) => {
  try {
    const egresos = await prisma.EGRESOS.findMany({
      orderBy: { date_out: "desc" },
      where: { status: "A" },
    });
    res.status(200).json(egresos);
  } catch (error) {
    console.log("Error al obtener egresos", error);
    res.status(500).json({ error: "Error al obtener egresos" });
  }
};

// Actualiza un egreso existente
export const updateEgreso = async (req, res) => {
  const { id } = req.params;
  const { id_subc, description, date_out, amount, auto } = req.body;

  try {
    const egreso = await prisma.EGRESOS.update({
      where: { id_out: parseInt(id) },
      data: {
        id_subc,
        description,
        date_out: new Date(date_out),
        amount: parseFloat(amount),
        auto,
      },
    });

    res.status(200).json({ message: "Egreso actualizado exitosamente" });
  } catch (error) {
    console.log("Error al actualizar egreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
