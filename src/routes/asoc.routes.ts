import { Router } from 'express';
import { listAll, create, update, deleteAsociation } from '../controllers/asoc.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

// router.get('/list-all', listAll);
router.get('/list-all', checkJwt, listAll);
router.get('/delete/:id_asociation/:date_updated_asociation', checkJwt, deleteAsociation);

router.post('/create', checkJwt, create);
router.post('/update', checkJwt, update);

export { router };
