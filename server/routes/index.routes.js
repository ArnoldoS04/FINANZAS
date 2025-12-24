import { Router } from "express";
import authRoutes, { loginLimiter } from "./auth.routes.js";
import inRoutes from "./in.routes.js";
import outRoutes from "./out.routes.js";
import dashRoutes from "./dash.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/in", inRoutes);
router.use("/out", outRoutes);
router.use("/dash", dashRoutes);

export default router;
