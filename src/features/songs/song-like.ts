import { Schema, model } from 'mongoose';

import CONFIG from '../../configuration/config';
import { removeInnerProperties as rip } from '../../utils/object-utils';

const { ObjectId } = Schema.Types;

let songLikeObj = {
    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    songId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now,
    },
}

/** Enable/Disable validations for schema */
if (!CONFIG.VALIDATE_DB_SCHEMA) {
    const propertiesToInclude = ['type', 'ref', 'default']; //todo default
    songLikeObj = rip(songLikeObj, propertiesToInclude);
}

const songLikeSchema = new Schema(
    songLikeObj,
    {
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

const SongLike = model('SongLike', songLikeSchema);

export default SongLike;