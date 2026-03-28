import { Request, Response, NextFunction } from "express";

import Song from './song';

function getLatestsSongs(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 0;

    Song.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .then(songs => {
            res.status(200).json(songs)
        })
        .catch(next);
}

function findSongById(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;

    Song.findOne({ '_id': songId })
        .then(song => {
            res.status(200).json(song)
        })
        .catch(next);
}

function createSong(req: Request, res: Response, next: NextFunction) {
    const { name, description, creator, date, origin } = req.body;

    Song.create({ name, description, creator, date, origin })
        .then(() => res.status(200).json("Song created."))
        .catch(next);
}

function editSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { name, description, creator, date, origin } = req.body;

    Song.updateOne(
            { _id: songId },
            { $set:
                {
                    name, description, creator, date, origin,
                    updated_at: Date.now()
                }
            },
            { runValidators: true }
        )
        .then(() => res.status(200).json("Song modified."))
        .catch(next);
}

function deleteSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;

    Song.deleteOne({ _id: songId })
        .then(() => res.status(200).json("Song deleted."))
        .catch(next);
}


export {
    getLatestsSongs,
    findSongById,
    createSong,
    editSong,
    deleteSong
}