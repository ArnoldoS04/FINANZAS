import { Router } from "express";
import {
  categorias,
  saveIngreso,
  getIngresos,
  updateIngreso,
  addAutoIngresos,
} from "../controllers/in.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categorias/:id", categorias);
router.post("/saveIn", verifyToken, saveIngreso);
router.get("/getIn", verifyToken, getIngresos);
router.put("/updateIn/:id", verifyToken, updateIngreso);
router.post("/addAutoIngresos/:id", verifyToken, addAutoIngresos);

export default router;
