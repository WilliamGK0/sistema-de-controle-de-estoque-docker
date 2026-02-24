export function me(req, res) {
  res.json({
    id: req.user.id,
    usuario: req.user.usuario,
    perfil: req.user.perfil,
  });
}