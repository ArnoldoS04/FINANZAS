import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtiene datos del dashboard
export const getDashboardData = async (req, res) => {
  try {
    // 🔹 Definir los rangos de fecha una sola vez
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    // 🔹 Ejecutar consultas en paralelo (más eficiente)
    const [
      ingresosMesActual,
      ingresosAnioActual,
      egresosMesActual,
      egresosAnioActual,
    ] = await Promise.all([
      prisma.iNGRESOS.aggregate({
        _sum: { amount: true },
        where: {
          date_in: { gte: startOfMonth, lt: startOfNextMonth },
          status: "A",
        },
      }),
      prisma.iNGRESOS.aggregate({
        _sum: { amount: true },
        where: {
          date_in: { gte: startOfYear, lt: startOfNextYear },
          status: "A",
        },
      }),
      prisma.eGRESOS.aggregate({
        _sum: { amount: true },
        where: {
          date_out: { gte: startOfMonth, lt: startOfNextMonth },
          status: "A",
        },
      }),
      prisma.eGRESOS.aggregate({
        _sum: { amount: true },
        where: {
          date_out: { gte: startOfYear, lt: startOfNextYear },
          status: "A",
        },
      }),
    ]);

    // 🔹 Respuesta clara y segura
    res.status(200).json({
      ingresosMesActual: ingresosMesActual._sum.amount || 0,
      ingresosAnioActual: ingresosAnioActual._sum.amount || 0,
      egresosMesActual: egresosMesActual._sum.amount || 0,
      egresosAnioActual: egresosAnioActual._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene ingresos por mes
export const getIncomesByMonth = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
  SELECT MONTH(date_in) AS Mes, SUM(amount) AS total_ingresos
  FROM INGRESOS
  WHERE YEAR(date_in) = YEAR(CURRENT_DATE()) AND status = 'A'
  GROUP BY MONTH(date_in)
  ORDER BY MONTH(date_in) asc
`;

    const formatted = result.map((r) => ({
      Mes: Number(r.Mes),
      total_ingresos: Number(r.total_ingresos),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error al obtener ingresos por mes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene egresos por mes
export const getExpensesByMonth = async (req, res) => {
  try {
    const expenses = await prisma.$queryRaw`
  SELECT MONTH(date_out) AS Mes, SUM(amount) AS total_egresos
  FROM EGRESOS
  WHERE YEAR(date_out) = YEAR(CURRENT_DATE()) and status='A'
  GROUP BY MONTH(date_out)
  ORDER BY MONTH(date_out) asc
`;
    const formatted = expenses.map((r) => ({
      Mes: Number(r.Mes),
      total_egresos: Number(r.total_egresos),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error al obtener gastos por mes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene ingresos por categoría
export const getIngresosPorCategoria = async (req, res) => {
  try {
    // 1️⃣ Calcular total general de ingresos activos
    // 🧮 Fechas del año actual
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);

    // 🔹 Total general de ingresos activos del año
    const totalGeneral = await prisma.iNGRESOS.aggregate({
      _sum: { amount: true },
      where: {
        status: "A",
        date_in: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
    });

    // 🔹 Agrupar ingresos por categoría
    const ingresosPorCategoria = await prisma.iNGRESOS.groupBy({
      by: ["id_subc"],
      _sum: { amount: true },
      _avg: { amount: true },
      where: {
        status: "A",
        date_in: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      orderBy: {
        _sum: { amount: "desc" },
      },
      take: 3,
    });

    // 🔹 Obtener nombres de subcategorías asociadas
    const ids = ingresosPorCategoria.map((i) => i.id_subc);
    const subcategorias = await prisma.sUBCATEGOR.findMany({
      where: { id_subc: { in: ids } },
      select: { id_subc: true, name: true },
    });

    // 🔹 Combinar resultados
    const resultados = ingresosPorCategoria.map((cat) => {
      const sub = subcategorias.find((s) => s.id_subc === cat.id_subc);
      return {
        id_subc: cat.id_subc,
        nombre_subcategoria: sub?.name || "Desconocido",
        total_categoria: cat._sum.amount,
        promedio_categoria: cat._avg.amount,
        porcentaje_total:
          totalGeneral._sum.amount > 0
            ? (cat._sum.amount / totalGeneral._sum.amount) * 100
            : 0,
      };
    });

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener ingresos por categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene egresos por categoría
export const getEgresosPorCategoria = async (req, res) => {
  try {
    // 1️⃣ Calcular total general de ingresos activos
    // 🧮 Fechas del año actual
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);

    // 🔹 Total general de ingresos activos del año
    const totalGeneral = await prisma.eGRESOS.aggregate({
      _sum: { amount: true },
      where: {
        status: "A",
        date_out: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
    });

    // 🔹 Agrupar egresos por categoría
    const egresosPorCategoria = await prisma.eGRESOS.groupBy({
      by: ["id_subc"],
      _sum: { amount: true },
      _avg: { amount: true },
      where: {
        status: "A",
        date_out: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      orderBy: {
        _sum: { amount: "desc" },
      },
      take: 3,
    });

    // 🔹 Obtener nombres de subcategorías asociadas
    const ids = egresosPorCategoria.map((i) => i.id_subc);
    const subcategorias = await prisma.sUBCATEGOR.findMany({
      where: { id_subc: { in: ids } },
      select: { id_subc: true, name: true },
    });

    // 🔹 Combinar resultados
    const resultados = egresosPorCategoria.map((cat) => {
      const sub = subcategorias.find((s) => s.id_subc === cat.id_subc);
      return {
        id_subc: cat.id_subc,
        nombre_subcategoria: sub?.name || "Desconocido",
        total_categoria: cat._sum.amount,
        promedio_categoria: cat._avg.amount,
        porcentaje_total:
          totalGeneral._sum.amount > 0
            ? (cat._sum.amount / totalGeneral._sum.amount) * 100
            : 0,
      };
    });

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener egresos por categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
