import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Realiza hash de contraseña
export const passHash = async (req, res) => {
  try {
    const { password } = req.body; // Usar 'password' en lugar de 'pass' para claridad

    const hashedPassword = bcrypt.hashSync(password, 10);
    res.status(200).json({ Hash: hashedPassword });
  } catch (error) {
    console.log("Error al hashear contraseña", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};
// Creación de token
export const creaToken = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Valida que los campos no estén vacíos
    if (!username || !password) {
      return res
        .status(400)
        .json({ mensaje: "Usuario y contraseña son requeridos" });
    }
    // Realiza busqueda de usuario
    const user = await prisma.usuarios.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }
    // Valida estado de usuario
    if (user.status !== "A") {
      return res.status(401).json({
        mensaje: "El usuario se encuentra bloqueado, comuníquese con soporte",
      });
    }
    // Genera el token JWT
    const payload = {
      id: user.idusuarios,
      name: user.username,
      rol: user.rol,
    };
    // Access Token (corto tiempo de vida)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    // Refresh Token (más largo)
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_TIEMPO_EXPIRA || "1h",
    });
    // Opciones de la cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000
      ), // Default a 7 días
      httpOnly: true, // ✅ Esto es lo recomendado para seguridad
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // ✅ O 'None' si usas HTTPS y dominios distintos
    };
    // Establecer la cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);
    // Enviar el token en JSON
    res.json({ accessToken });
  } catch (error) {
    console.log("Error al crear toke: ", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};
// Refresca Token
export const refreshToken = (req, res) => {
  console.log("llama refresh");
  const token = req.cookies.refreshToken;
  console.log(req.cookies.refreshToken);
  if (!token) return res.status(401).json({ mensaje: "No autorizado" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });

    const newAccessToken = jwt.sign(
      { id: user.id, name: user.name, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};
export const consulta = async (req, res) => {
  try {
    const consul = await prisma.usuarios.count();
    console.log(consul);
    res.json({ mensaje: consul });
  } catch (error) {
    res.json({ mensaje: "no se puede" });
    console.log(error);
  }
};
//  Elimina token
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.json({ mensaje: "Sesión cerrada correctamente" });
};
