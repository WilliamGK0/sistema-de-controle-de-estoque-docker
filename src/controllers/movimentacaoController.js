import { conectarDb } from "../db/connection.js";

function agoraISO() {
  return new Date().toISOString();
}

export async function registrarEntrada(req, res) {
  const { produto_id, quantidade } = req.body;

  if (!produto_id || !quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: "produto_id e quantidade (>0) são obrigatórios" });
  }

  const db = await conectarDb();

  const produto = await db.get(`SELECT * FROM produtos WHERE id = ?`, [produto_id]);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

  // atualiza estoque
  const novoEstoque = produto.quantidade + quantidade;

  await db.run(`UPDATE produtos SET quantidade = ? WHERE id = ?`, [novoEstoque, produto_id]);

  // registra movimentação
  await db.run(
    `INSERT INTO movimentacoes (produto_id, tipo, quantidade, data_hora, usuario_id)
     VALUES (?, ?, ?, ?, ?)`,
    [produto_id, "entrada", quantidade, agoraISO(), req.user.id]
  );

  res.status(201).json({ mensagem: "Entrada registrada", estoque_atual: novoEstoque });
}

export async function registrarSaida(req, res) {
  const { produto_id, quantidade } = req.body;

  if (!produto_id || !quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: "produto_id e quantidade (>0) são obrigatórios" });
  }

  const db = await conectarDb();

  const produto = await db.get(`SELECT * FROM produtos WHERE id = ?`, [produto_id]);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

  // regra: não permitir saída maior que o estoque
  if (quantidade > produto.quantidade) {
    return res.status(400).json({ erro: "Saída maior que o estoque disponível" });
  }

  const novoEstoque = produto.quantidade - quantidade;

  // regra: não permitir negativo (garantia extra)
  if (novoEstoque < 0) {
    return res.status(400).json({ erro: "Quantidade não pode ficar negativa" });
  }

  await db.run(`UPDATE produtos SET quantidade = ? WHERE id = ?`, [novoEstoque, produto_id]);

  await db.run(
    `INSERT INTO movimentacoes (produto_id, tipo, quantidade, data_hora, usuario_id)
     VALUES (?, ?, ?, ?, ?)`,
    [produto_id, "saida", quantidade, agoraISO(), req.user.id]
  );

  res.status(201).json({ mensagem: "Saída registrada", estoque_atual: novoEstoque });
}

export async function listarMovimentacoes(req, res) {
  const db = await conectarDb();

  const movs = await db.all(`
    SELECT m.*, p.nome AS produto_nome, u.usuario AS usuario_nome
    FROM movimentacoes m
    JOIN produtos p ON p.id = m.produto_id
    JOIN usuarios u ON u.id = m.usuario_id
    ORDER BY m.id DESC
  `);

  res.json(movs);
}