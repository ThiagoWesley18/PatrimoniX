import { Router } from "express";
import rentabilidadeController from "./rentabilidade.controller";
import validateBody from "../../middlewares/validateBody";
import rentabilidadeSchema from "./rentabilidade.schema";
const router = Router();

router.post("/", validateBody(rentabilidadeSchema.create), rentabilidadeController.create);
router.get("/", rentabilidadeController.index);
router.get("/:id", rentabilidadeController.read);
router.delete("/:id", rentabilidadeController.remove);

export default router;
