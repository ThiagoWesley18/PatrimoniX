import { Router } from "express";
import respostaAtivoController from "./resposta_ativo.controller";

const router = Router();

router.get("/", respostaAtivoController.find);
router.post("/", respostaAtivoController.create);
router.patch('/:codigo/:perguntaId', respostaAtivoController.update);
router.delete('/:codigo/:perguntaId', respostaAtivoController.remove);

export default router;