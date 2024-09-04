import { Router } from "express";
import perguntaController from "./pergunta.controller";

const router = Router();

router.get("/", perguntaController.index);
router.post("/", perguntaController.create);
router.put("/:id", perguntaController.update);
router.delete("/:id", perguntaController.delete);

export default router;