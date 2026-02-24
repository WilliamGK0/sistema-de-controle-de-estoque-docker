import { conectarDb } from "../db/connection.js";

// GET /relatorios/baixo-estoque
export async function baixoEstoque(req, res) {
  const db = await conectarDb();

  const produtos = await db.all(`
    SELECT *
    FROM produtos
    WHERE quantidade <= minimo
    ORDER BY quantidade ASC
  `);

  res.json(produtos);
}