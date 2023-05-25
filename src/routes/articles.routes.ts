import { Router } from 'express';
import { listAll, create, update, deleteArticle } from '../controllers/artic.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.get('/list-all', checkJwt, listAll);
router.get('/delete/:id_article/:date_updated_article', checkJwt, deleteArticle);

router.post('/create', checkJwt, create);
router.post('/update', checkJwt, update);

export { router };
