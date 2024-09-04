import { Router } from "express"
import tipoAtivoController from "./tipo_ativo.controller"

const router = Router()

router.get('/', tipoAtivoController.index);
router.get('/:id', tipoAtivoController.read);
router.post('/', tipoAtivoController.create);

export default router;
