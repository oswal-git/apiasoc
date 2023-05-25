import { Router } from 'express';
import { deleteCover, deleteImage, moveItemImage, uploadImage, uploadItemImage } from '../controllers/image.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.get('/delete-image/:prefix/:id_user/:date_updated_user', checkJwt, deleteImage);
router.get('/delete-cover/:id_asociation_article/:id_article/:date_updated_article', checkJwt, deleteCover);

router.post('/upload', uploadImage);
router.post('/upload-item', uploadItemImage);
router.post('/move-item', checkJwt, moveItemImage);

export { router };
