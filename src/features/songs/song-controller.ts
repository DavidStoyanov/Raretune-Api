import { Request, Response, NextFunction } from "express";

import Song from './song';
import User from "../users/user";
import SongLike from "./song-like";

function getLatestSongs(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 0;

    Song.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(songs => {
            res.status(200).json(songs);
        })
        .catch(next);
}

function getFavoriteSongs(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const limit = Number(req.query.limit) || 0;

    Song.find({ likedBy: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(songs => {
            res.status(200).json(songs);
        })
        .catch(next);
}

async function getLatestThreeSongs(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const criteria: string | unknown = req.query.criteria;

    const findLastThreeLikedSongs = async () => {
        try {
            const liked = await SongLike.find({ userId })
                .sort({ likedAt: -1 })
                .limit(3)
                .select('songId');

            const songs = await Song.aggregate([
                {
                    $match: { _id: { $in: liked.map(x => x.songId) } }
                },
                
                {
                    $lookup: {
                        from: "songlikes",
                        localField: "_id",
                        foreignField: "songId",
                        as: "songlike"
                    }
                },

                {   $unwind: "$songlike" },

                {   $sort: { "songlike.likedAt": -1 } },

                {
                    $group: {
                        _id: "$_id",
                        doc: { $first: "$$ROOT" }
                    }
                },

                { $replaceRoot: { newRoot: "$doc" } },

                { $limit: 3 },

                {
                    $project: {
                        id: "$_id",
                        name: 1,
                        description: 1,
                        creator: 1,
                        _id: 0,
                    }
                }
            ]);

            res.status(200).json(songs);
        } catch (err) {
            next(err);
        }
    }


    const findLastThreePostedSongs = async () => {
        try {
            const songs = await Song.find({ posterId: userId })
                .sort({ createdAt: -1 })
                .limit(3);

            res.status(200).json(songs);
        } catch (err) {
            next(err);
        }
    };


    switch (criteria) {
        case 'liked': await findLastThreeLikedSongs(); return;
        case 'posted': await findLastThreePostedSongs(); return;
        default: next(new Error("Invalid criteria on getLatestThreeSongs()"));
    }

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
    const { name, description, creator, date, origin, songUrl } = req.body;
    const { id: userId } = req.user;

    Song.create({ name, description, creator, date, origin, songUrl, posterId: userId })
        .then((song) => User.findByIdAndUpdate(userId, { postedSongs: song.id }))
        .then(() => res.status(200).json("Song created."))
        .catch(next);
}

async function editSong(req: Request, res: Response, next: NextFunction) {
    const { songId } = req.params;
    const { name, description, creator, date, origin, songUrl } = req.body;
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
            songUrl,
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

        await SongLike.deleteMany({ songId });

        res.json({ message: "Song deleted successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getCountForSongs(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const criteria: string | unknown = req.query.criteria;

    const getCountForLikedSongs = async () => {
        try {
            const count = await SongLike.countDocuments({ userId });
            res.status(200).json(count);
        } catch (err) {
            next(err);
        }
    }

    const getCountForPostedSongs = async () => {
        try {
            const count = await Song.countDocuments({ posterId: userId });
            res.status(200).json(count);
        } catch (err) {
            next(err);
        }
    };

    switch (criteria) {
        case 'liked': await getCountForLikedSongs(); return;
        case 'posted': await getCountForPostedSongs(); return;
        default: next(new Error("Invalid criteria on getCountForSongs()"));
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

        await SongLike.create({
            userId,
            songId: (songId as string)
        });

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

        await SongLike.deleteOne({
            userId,
            songId
        });

        res.json({ message: "Song disliked successfully." });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getLiked(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const songIds = req.body;

    try {
        const likes = await SongLike.find({
            songId: { $in: songIds },
            userId
        });

        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        next(err);
    }
}



export {
    getLatestSongs,
    getFavoriteSongs,
    getLatestThreeSongs,
    findSongById,
    createSong,
    editSong,
    deleteSong,
    getCountForSongs,
    likeSong,
    dislikeSong,
    getLiked
}