import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { permitir } from "../middlewares/permissaoMiddleware.js";
import {
  criarUsuario,
  listarUsuarios,
  alterarPerfil,
} from "../controllers/usuarioController.js";

const router = Router();

router.post("/", autenticarToken, permitir("admin"), criarUsuario);
router.get("/", autenticarToken, permitir("admin"), listarUsuarios);
router.patch("/:id/perfil", autenticarToken, permitir("admin"), alterarPerfil);

export default router;