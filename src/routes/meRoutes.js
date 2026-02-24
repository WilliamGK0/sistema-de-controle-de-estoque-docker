import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { me } from "../controllers/meController.js";

const router = Router();

router.get("/me", autenticarToken, me);

export default router;