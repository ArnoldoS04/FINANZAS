import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtiene categorías por ID de categoría principal
export const categorias = async (req, res) => {
  const { id } = req.params;
  const status = "A";
  try {
    const categoria = await prisma.SUBCATEGOR.findMany({
      where: {
        id_cat: parseInt(id),
        status: status,
      },
    });
    res.status(200).json(categoria);
  } catch (error) {
    console.log("Error al obtener categorías", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Inserta nuevo ingreso
export const saveIngreso = async (req, res) => {
  const { id_subc, description, date_in, amount, auto } = req.body;
  const id_usr = req.user.id; // Obtener ID del usuario desde el token

  try {
    const ingreso = await prisma.INGRESOS.create({
      data: {
        id_subc,
        id_usr,
        description,
        date_in,
        amount,
        auto,
      },
    });

    res.status(201).json({ message: "Ingreso creado exitosamente" });
  } catch (error) {
    console.log("Error al insertar ingreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene todos los ingresos
export const getIngresos = async (req, res) => {
  try {
    const ingresos = await prisma.INGRESOS.findMany({
      where: {
        status: "A",
        OR: [
          {
            date_in: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          },
          { auto: true },
        ],
      },
      orderBy: [{ auto: "desc" }, { date_in: "desc" }],
      distinct: ["description"],
    });
    res.status(200).json(ingresos);
  } catch (error) {
    console.error("Error al obtener ingresos", error);
    res.status(500).json({ error: "Error al obtener ingresos" });
  }
};

// Actualiza un ingreso existente
export const updateIngreso = async (req, res) => {
  const { id } = req.params;
  const { id_subc, description, date_in, amount, auto } = req.body;
  try {
    const ingreso = await prisma.INGRESOS.update({
      where: { id_in: parseInt(id) },
      data: {
        id_subc,
        description,
        date_in,
        amount,
        auto,
      },
    });
    res.status(200).json({ message: "Ingreso actualizado exitosamente" });
  } catch (error) {
    console.log("Error al actualizar ingreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agrega ingresos recurrentes
export const addAutoIngresos = async (req, res) => {
  const { id } = req.params;

  try {
    const ingreso = await prisma.INGRESOS.findUnique({
      where: { id_in: parseInt(id) },
    });

    await prisma.INGRESOS.create({
      data: {
        id_subc: ingreso.id_subc,
        id_usr: ingreso.id_usr,
        description: ingreso.description,
        date_in: new Date(),
        amount: ingreso.amount,
        auto: ingreso.auto,
      },
    });

    res.status(200).json({ message: "Pago registrado exitosamente" });
  } catch (error) {
    console.log("Error al actualizar ingreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
