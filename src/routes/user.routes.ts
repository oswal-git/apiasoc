import { Router } from 'express';
import { deleteImage, uploadImage } from '../controllers/image.controller';
import { create, listAll, deleteUser, update } from '../controllers/user.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

// router.get('/list-all', listAll);
router.get('/list-all', checkJwt, listAll);
router.get('/delete-image/:prefix/:id_user/:date_updated_user', checkJwt, deleteImage);

router.get('/delete/:id_user/:date_updated_user', checkJwt, deleteUser);
router.post('/create', checkJwt, create);

router.post('/update', checkJwt, update);

router.post('/upload', uploadImage);

export { router };
