import { Router } from "express";
import {
  getDashboardData,
  getIncomesByMonth,
  getExpensesByMonth,
  getIngresosPorCategoria,
  getEgresosPorCategoria,
} from "../controllers/dash.controller.js";

const router = Router();

router.get("/dashboard", getDashboardData);
router.get("/incomes/month", getIncomesByMonth);
router.get("/expenses/month", getExpensesByMonth);
router.get("/incomes/category", getIngresosPorCategoria);
router.get("/expenses/category", getEgresosPorCategoria);

export default router;
