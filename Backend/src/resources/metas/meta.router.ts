import { Router } from 'express';
import metasController from './meta.controller';
import validateBody from '../../middlewares/validateBody';
import { metaSchema } from './meta.escheme';

const router = Router();

router.post('/createMeta', validateBody(metaSchema.setMeta) ,metasController.create);
router.post('/delete', validateBody(metaSchema.deleteMeta), metasController.deleteMetaByName);
router.get('/getMetas',metasController.getMetaAll);
router.put('/update', validateBody(metaSchema.setMeta), metasController.update);

export default router;