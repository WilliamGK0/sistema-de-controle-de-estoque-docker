import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { permitir } from "../middlewares/permissaoMiddleware.js";
import { baixoEstoque } from "../controllers/relatorioController.js";

const router = Router();

router.get(
  "/baixo-estoque",
  autenticarToken,
  permitir("admin", "estoquista", "consulta"),
  baixoEstoque
);

export default router;