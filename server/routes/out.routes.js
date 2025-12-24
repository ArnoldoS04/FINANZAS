import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getEgresos,
  saveEgreso,
  updateEgreso,
} from "../controllers/out.controller.js";

const router = Router();

router.get("/getOut", verifyToken, getEgresos);
router.post("/saveOut", verifyToken, saveEgreso);
router.put("/updateOut/:id", verifyToken, updateEgreso);

export default router;
