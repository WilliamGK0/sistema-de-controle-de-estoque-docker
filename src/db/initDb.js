import { conectarDb } from "./connection.js";

export async function initDb() {
  const db = await conectarDb();

  // tabela usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL
    );
  `);

  // tabela produtos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 0,
      minimo INTEGER NOT NULL DEFAULT 0
    );
  `);

  // tabela movimentacoes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      data_hora TEXT NOT NULL,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (produto_id) REFERENCES produtos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

    // cria admin padrão se não existir
const adminExiste = await db.get(
  `SELECT * FROM usuarios WHERE usuario = ?`,
  ["admin"]
);

if (!adminExiste) {
  await db.run(
    `INSERT INTO usuarios (usuario, senha, perfil)
     VALUES (?, ?, ?)`,
    ["admin", "123456", "admin"]
  );

  console.log("Admin padrão criado");
}

  console.log("Banco inicializado");
}