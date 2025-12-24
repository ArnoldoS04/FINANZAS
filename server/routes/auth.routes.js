import { Router } from "express";
import {
  consulta,
  creaToken,
  logout,
  passHash,
  refreshToken,
} from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();
// Establece un limite de 5 intentos por default al intentar ingresar
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  message: "Ha superado el numero de intentos, intente de nuevo más tarde",
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/passhash", passHash);
router.post("/login", creaToken);
router.post("/logout", logout);
router.get("/consult", verifyToken, consulta);
router.post("/refresh", refreshToken);

export default router;
