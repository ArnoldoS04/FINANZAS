import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Inserta nuevo egreso
export const saveEgreso = async (req, res) => {
  const { id_subc, description, date_out, amount, auto } = req.body;
  const id_usr = req.user.id; // Obtener ID del usuario desde el token
  console.log(req.body);
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
    const now = new Date();
    const egresos = await prisma.EGRESOS.findMany({
      where: {
        status: "A",
        OR: [
          {
            date_out: {
              gte: new Date(now.getFullYear(), now.getMonth(), 1),
              lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
            },
          },
          { auto: true },
        ],
      },
      orderBy: [{ auto: "desc" }, { date_out: "desc" }],
      distinct: ["description"],
    });

    // 🔑 SERIALIZACIÓN CORRECTA
    const result = egresos.map((e) => ({
      ...e,
      date_out: e.date_out ? e.date_out.toISOString().split("T")[0] : null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener egresos", error);
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

// Agrega egresos recurrentes
export const addAutoEgresos = async (req, res) => {
  const { id } = req.params;

  try {
    const egreso = await prisma.EGRESOS.findUnique({
      where: { id_out: parseInt(id) },
    });

    await prisma.EGRESOS.create({
      data: {
        id_subc: egreso.id_subc,
        id_usr: egreso.id_usr,
        description: egreso.description,
        date_out: new Date(),
        amount: egreso.amount,
        auto: egreso.auto,
      },
    });

    res.status(200).json({ message: "Pago registrado exitosamente" });
  } catch (error) {
    console.log("Error al actualizar egreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
