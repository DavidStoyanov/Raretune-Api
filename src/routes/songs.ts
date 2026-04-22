import { Router } from 'express';

import { createSong, getLatestsSongs, findSongById, editSong, deleteSong } from '../features/songs/song-controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', getLatestsSongs);
router.post('/', auth, createSong);

router.get('/:songId', findSongById);
router.put('/:songId', auth, editSong);
router.delete('/:songId', auth, deleteSong);

export default router;