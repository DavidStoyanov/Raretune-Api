import { Router } from 'express';

import { auth } from '../middlewares/auth';
import { login, register, logout, getProfileInfo, editProfileInfo } from '../features/users/users-controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', auth, getProfileInfo);
router.patch('/profile', auth, editProfileInfo);

export default router;