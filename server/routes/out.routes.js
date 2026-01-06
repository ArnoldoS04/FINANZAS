import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getEgresos,
  saveEgreso,
  updateEgreso,
  addAutoEgresos,
} from "../controllers/out.controller.js";

const router = Router();

router.get("/getOut", getEgresos);
router.post("/saveOut", verifyToken, saveEgreso);
router.put("/updateOut/:id", verifyToken, updateEgreso);
router.post("/addAutoEgresos/:id", addAutoEgresos);

export default router;
