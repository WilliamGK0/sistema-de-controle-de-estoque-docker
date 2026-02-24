import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { autenticarToken } from "./middlewares/authMiddleware.js";
import { permitir } from "./middlewares/permissaoMiddleware.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import movimentacaoRoutes from "./routes/movimentacaoRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";
import meRoutes from "./routes/meRoutes.js";
import { auditoria } from "./middlewares/auditoriaMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

app.use(auditoria);

app.use("/auth", authRoutes);

app.use("/usuarios", usuarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/movimentacoes", movimentacaoRoutes);
app.use("/relatorios", relatorioRoutes);
app.use(meRoutes);

export default app;