import { conectarDb } from "../db/connection.js";

const PERFIS_VALIDOS = ["admin", "estoquista", "consulta"];

export async function criarUsuario(req, res) {
  const { usuario, senha, perfil } = req.body;

  if (!usuario || !senha || !perfil) {
    return res.status(400).json({ erro: "usuario, senha e perfil são obrigatórios" });
  }

  if (!PERFIS_VALIDOS.includes(perfil)) {
    return res.status(400).json({ erro: "perfil inválido (admin | estoquista | consulta)" });
  }

  const db = await conectarDb();

  try {
    const result = await db.run(
      `INSERT INTO usuarios (usuario, senha, perfil)
       VALUES (?, ?, ?)`,
      [usuario, senha, perfil]
    );

    res.status(201).json({
      mensagem: "Usuário criado",
      id: result.lastID,
      usuario,
      perfil,
    });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ erro: "Usuário já existe" });
    }
    return res.status(500).json({ erro: "Erro ao criar usuário" });
  }
}

export async function listarUsuarios(req, res) {
  const db = await conectarDb();

  // não retornar senha
  const usuarios = await db.all(
    `SELECT id, usuario, perfil FROM usuarios ORDER BY id ASC`
  );

  res.json(usuarios);
}

export async function alterarPerfil(req, res) {
  const { id } = req.params;
  const { perfil } = req.body;

  if (!perfil) {
    return res.status(400).json({ erro: "perfil é obrigatório" });
  }

  if (!PERFIS_VALIDOS.includes(perfil)) {
    return res.status(400).json({ erro: "perfil inválido (admin | estoquista | consulta)" });
  }

  const db = await conectarDb();

  const user = await db.get(`SELECT id, usuario, perfil FROM usuarios WHERE id = ?`, [id]);
  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  await db.run(`UPDATE usuarios SET perfil = ? WHERE id = ?`, [perfil, id]);

  res.json({ mensagem: "Perfil atualizado", id: Number(id), perfil });
}