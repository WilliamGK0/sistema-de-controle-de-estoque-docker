import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { permitir } from "../middlewares/permissaoMiddleware.js";
import {
  criarProduto,
  listarProdutos,
  buscarProduto,
  atualizarProduto,
  deletarProduto,
} from "../controllers/produtoController.js";

const router = Router();

router.post("/", autenticarToken, permitir("admin", "estoquista"), criarProduto);
router.get("/", autenticarToken, permitir("admin", "estoquista", "consulta"), listarProdutos);
router.get("/:id", autenticarToken, permitir("admin", "estoquista", "consulta"), buscarProduto);
router.patch("/:id", autenticarToken, permitir("admin", "estoquista"), atualizarProduto);
router.delete("/:id", autenticarToken, permitir("admin"), deletarProduto);

export default router;