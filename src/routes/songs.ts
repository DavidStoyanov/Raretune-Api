import { Router } from 'express';

import { 
    createSong, getLatestsSongs, findSongById,
    editSong, deleteSong, likeSong,
    dislikeSong
} from '../features/songs/song-controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', getLatestsSongs);
router.post('/', auth, createSong);

router.get('/:songId', findSongById);
router.put('/:songId', auth, editSong);
router.delete('/:songId', auth, deleteSong);

router.post('/:songId/like', auth, likeSong);
router.delete('/:songId/like', auth, dislikeSong);

export default router;