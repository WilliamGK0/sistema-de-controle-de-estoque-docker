import { conectarDb } from "../db/connection.js";

export async function criarProduto(req, res) {
  const { nome, quantidade, minimo } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }

  const db = await conectarDb();

  await db.run(
    `INSERT INTO produtos (nome, quantidade, minimo)
     VALUES (?, ?, ?)`,
    [nome, quantidade ?? 0, minimo ?? 0]
  );

  res.status(201).json({ mensagem: "Produto criado com sucesso" });
}

export async function listarProdutos(req, res) {
  const db = await conectarDb();

  const produtos = await db.all(`SELECT * FROM produtos`);

  res.json(produtos);
}

export async function buscarProduto(req, res) {
  const { id } = req.params;

  const db = await conectarDb();

  const produto = await db.get(
    `SELECT * FROM produtos WHERE id = ?`,
    [id]
  );

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json(produto);
}

export async function atualizarProduto(req, res) {
  const { id } = req.params;
  const { nome, minimo } = req.body;

  const db = await conectarDb();

  await db.run(
    `UPDATE produtos
     SET nome = COALESCE(?, nome),
         minimo = COALESCE(?, minimo)
     WHERE id = ?`,
    [nome, minimo, id]
  );

  res.json({ mensagem: "Produto atualizado" });
}

export async function deletarProduto(req, res) {
  const { id } = req.params;

  const db = await conectarDb();

  await db.run(`DELETE FROM produtos WHERE id = ?`, [id]);

  res.json({ mensagem: "Produto removido" });
}