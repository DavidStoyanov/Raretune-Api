import { Request, Response, NextFunction } from "express";

import Song from './song';
import User from "../users/user";

function getLatestsSongs(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 0;

    Song.find()
        .sort({ createdAt: -1 })
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
    const { id: userId } = req.user;

    Song.create({ name, description, creator, date, origin, user_id: userId })
        .then((song) => User.findByIdAndUpdate(userId, { postedSongs: song.id }))
        .then(() => res.status(200).json("Song created."))
        .catch(next);
}

async function editSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { name, description, creator, date, origin } = req.body;
    const { id: userId } = req.user;

    try {
        const song = await Song.findById(songId);

        if (!song) {
            throw new Error("Song not found");
        }

        if (song.posterId.toString() !== userId) {
            throw new Error("You are not the owner of this song");
        }

        /* await Song.updateOne(
            { _id: songId },
            {
                $set: {
                    name,
                    description,
                    updatedAt: Date.now()
                }
            }
        ); */

        song.set({
            name,
            description,
            creator,
            date,
            origin,
            updatedAt: Date.now()
        });

        await song.save();

        res.json({ message: "Song updated successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }

}

async function deleteSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { id: userId } = req.user;

    try {
        const song = await Song.findById(songId);

        if (!song) {
            throw new Error("Song not found");
        }

        if (song.posterId.toString() !== userId) {
            throw new Error("You are not the owner of this song");
        }

        await song.deleteOne();

        await User.updateOne(
            { _id: userId },
            { $pull: { postedSongs: songId } }
        );

        res.json({ message: "Song deleted successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function likeSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { id: userId } = req.user;

    try {
        const song = await Song.findById(songId);

        if (!song) {
            throw new Error("Song not found");
        }

        //todo: song.likedBy.includes(userId)
        if ((song.likedBy as unknown as string[]).includes(userId as string)) {
            throw new Error("You already liked the song");
        }

        await (song.likedBy as unknown as string[]).push(userId as string);

        await song.save();

        res.json({ message: "Song liked successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function dislikeSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { id: userId } = req.user;

    try {
        const song = await Song.findById(songId);

        if (!song) {
            throw new Error("Song not found");
        }

        if (!(song.likedBy as unknown as string[]).includes(userId as string)) {
            throw new Error("Cant dislike unliked song");
        }

        await Song.updateOne(
            { _id: songId },
            { $pull: { likedBy: userId } }
        );

        res.json({ message: "Song disliked successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }
}



export {
    getLatestsSongs,
    findSongById,
    createSong,
    editSong,
    deleteSong,
    likeSong,
    dislikeSong
}