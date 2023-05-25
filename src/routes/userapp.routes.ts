import { Router } from 'express';
import { create, listQuestions, deleteUser, update, validateAnswer } from '../controllers/userapp.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.get('/list-questions/:user_name/:asociation_id', listQuestions);

router.post('/validate-answer', validateAnswer);
router.post('/create', create);

router.get('/delete/:id_user/:date_updated_user', checkJwt, deleteUser);
router.post('/update', checkJwt, update);

export { router };
