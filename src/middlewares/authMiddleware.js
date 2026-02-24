import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // precisa vir: Authorization: Bearer <token>
  if (!authHeader) {
    return res.status(401).json({ erro: "Token nao fornecido" });
  }

  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Formato do token inválido" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // o PDF pede: id, usuario, perfil em req.user
    req.user = {
      id: payload.id,
      usuario: payload.usuario,
      perfil: payload.perfil,
    };

    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token invalido ou expirado" });
  }
}