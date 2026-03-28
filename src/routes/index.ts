import { Router } from 'express';

import songs from './songs'

const router = Router();

router.use('/songs', songs)


export default router;