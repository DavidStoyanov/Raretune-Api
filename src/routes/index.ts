import { Router } from 'express';

import users from './users';
import songs from './songs'


const router = Router();

router.use('/users', users);
router.use('/songs', songs);


export default router;