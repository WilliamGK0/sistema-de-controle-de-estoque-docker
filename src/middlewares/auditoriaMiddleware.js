import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// caminho do arquivo acessos.log na raiz do projeto
const logPath = path.join(__dirname, "../../acessos.log");

export function auditoria(req, res, next) {
  // esperar a resposta terminar
  res.on("finish", () => {
    if (req.user) {
      const linha = `${new Date().toISOString()} | ${req.user.usuario} (${req.user.perfil}) | ${req.method} ${req.originalUrl}\n`;

      fs.appendFile(logPath, linha, (err) => {
        if (err) {
          console.error("Erro ao registrar log:", err.message);
        }
      });
    }
  });

  next();
}