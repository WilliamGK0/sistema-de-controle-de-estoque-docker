import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { permitir } from "../middlewares/permissaoMiddleware.js";
import {
  registrarEntrada,
  registrarSaida,
  listarMovimentacoes,
} from "../controllers/movimentacaoController.js";

const router = Router();

router.post("/entrada", autenticarToken, permitir("admin", "estoquista"), registrarEntrada);
router.post("/saida", autenticarToken, permitir("admin", "estoquista"), registrarSaida);
router.get("/", autenticarToken, permitir("admin", "estoquista", "consulta"), listarMovimentacoes);

export default router;