import { Router } from 'express';
import {
    login,
    userLogin,
    logout,
    profile,
    register,
    changePassword,
    connectedUser,
    resetPassword,
    registreGeneric,
} from '../controllers/auth.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.post('/login', login);
router.post('/user-login', userLogin);
router.get('/logout', checkJwt, logout);
router.post('/register', register);
router.post('/registre-generic', checkJwt, registreGeneric);
router.post('/profile', checkJwt, profile);
router.post('/change', checkJwt, changePassword);
router.post('/reset', resetPassword);
router.get('/connected-user', checkJwt, connectedUser);

export { router };
