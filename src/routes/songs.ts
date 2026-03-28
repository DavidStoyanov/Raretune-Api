import { Router } from 'express';

import { createSong, getLatestsSongs, findSongById, editSong, deleteSong } from '../features/songs/song-service';

const router = Router();

router.get('/', getLatestsSongs);
router.post('/', createSong);

router.get('/:songId', findSongById);
router.put('/:songId', editSong);
router.delete('/:songId', deleteSong);

export default router;