import { Schema, model } from 'mongoose';

import CONFIG from '../../configuration/config';
import { removeInnerProperties as rip } from '../../utils/object-utils';

const { ObjectId } = Schema.Types;

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
        type: String,
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
    poster_id: {
        type: ObjectId,
        ref: "User"
    },
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
            createdAt: 'created_at',
            updatedAt: 'updated_at',
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