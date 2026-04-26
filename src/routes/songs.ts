import { Router } from 'express';

import { 
    createSong, getLatestSongs, findSongById,
    editSong, deleteSong, likeSong,
    dislikeSong, getLatestThreeSongs,
    getCountForSongs, getFavoriteSongs,
    getLiked
} from '../features/songs/song-controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', getLatestSongs);
router.post('/', auth, createSong);

router.get('/three', auth, getLatestThreeSongs);
router.get('/count', auth, getCountForSongs);
router.get('/favorites', auth, getFavoriteSongs);
router.post('/songlikes', auth, getLiked);

router.get('/:songId', findSongById);
router.put('/:songId', auth, editSong);
router.delete('/:songId', auth, deleteSong);

router.post('/:songId/like', auth, likeSong);
router.delete('/:songId/like', auth, dislikeSong);


export default router;