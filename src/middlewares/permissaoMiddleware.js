export function permitir(...perfisPermitidos) {
  return (req, res, next) => {
    const perfilUsuario = req.user?.perfil;

    if (!perfilUsuario) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    if (!perfisPermitidos.includes(perfilUsuario)) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    next();
  };
}