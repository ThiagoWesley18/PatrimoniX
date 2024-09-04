import { Router } from "express"
import ativoController from "./ativo.controller"

const router = Router()

router.get('/', ativoController.index);
router.get('/:id', ativoController.read);
router.get('/outros/find', ativoController.outros); // find não necessário, mas apenas /outros não funciona
router.post('/', ativoController.create);



export default router;
