import sqlite3 from "sqlite3";
import { open } from "sqlite";

// abre conexão com o banco
export async function conectarDb() {
  const dbFile = process.env.DB_FILE || "./data/estoque.db";

  return open({
    filename: dbFile,
    driver: sqlite3.Database
  });
}