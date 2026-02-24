import jwt from "jsonwebtoken";
import { conectarDb } from "../db/connection.js";

export async function login(req, res) {
  const { usuario, senha } = req.body;

  const db = await conectarDb();

  const user = await db.get(
    `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`,
    [usuario, senha]
  );

  if (!user) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      perfil: user.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
}