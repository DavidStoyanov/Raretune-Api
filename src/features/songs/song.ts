import { Schema, model } from 'mongoose';

import CONFIG from '../../configuration/config';
import { removeInnerProperties as rip } from '../../utils/object-utils';

const { ObjectId } = Schema.Types;

interface ISong {
    name: string;
    description: string;
    creator: string;
    date: string;
    origin: string;
    posterId: typeof ObjectId;
    creatorId: typeof ObjectId;
    likedBy?: typeof ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

let songObj = {
    name: {
        type: String,
        required: [true, "Song name should be at least 2 characters long"],
        minLength: [2, "Song name should be at least 2 characters long"],
        maxLength: [30, "Song name must not exceed 30 characters"],
    },
    description: {
        type: String,
        required: [true, "Song description should be at least 10 characters long"],
        minLength: [10, "Song description should be at least 10 characters long"],
        maxLength: [1000, "Song description must not exceed 1000 characters"],
    },
    creator: {
        type: String, //todo: remove
        required: [true, "Song creator name should be at least 2 characters long"],
        minLength: [2, "Song creator name should be at least 2 characters long"],
        maxLength: [30, "Song creator name must not exceed 30 characters"],
    },
    date: {
        type: String,
        required: [false],
    },
    origin: {
        type: String,
        required: [false],
    },
    posterId: {
        type: ObjectId,
        ref: "User"
    },
    creatorId: {
        type: ObjectId,
        ref: "User" //todo: implement
    },
    likedBy: [{
        type: ObjectId,
        ref: "User"
    }],
}

/** Enable/Disable validations for schema */
if (!CONFIG.VALIDATE_DB_SCHEMA) {
    const propertiesToInclude = ['type', 'ref'];
    songObj = rip(songObj, propertiesToInclude);
}

const songSchema = new Schema(
    songObj,
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc: unknown, ret: Record<string, unknown>) => {
                ret.id = ret._id;
                delete ret._id;
            } 
        }
    }
);

const Song = model('Song', songSchema);

export default Song;