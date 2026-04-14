import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import CONFIG from '../../configuration/config';
import { removeInnerProperties as rip } from '../../utils/object-utils';

const { ObjectId } = Schema.Types;

export interface IUser {
    id?: string;
    __v?: string;
    email: string;
    username: string;
    password?: string;
    posted_songs: typeof ObjectId[];
    own_songs: typeof ObjectId[];
    matchPassword(password: string): Promise<boolean>;
}

export interface IUserCreate {
    password: string;
}

let userObj = {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Username should be at least 2 characters long"],
        minLength: [2, "Username should be at least 2 characters long"],
        maxLength: [25, "Username must not exceed 25 characters"],
    },
    password: {
        type: String,
        required: [true, "Password should be at least 6 characters long"],
        minLength: [2, "Password should be at least 6 characters long"],
        maxLength: [30, "Password must not exceed 255 characters"],
    },
    posted_songs: [{
        type: ObjectId,
        ref: "Song",
    }],
    own_songs: [{
        type: ObjectId,
        ref: "Song",
    }],
}

/** Enable/Disable validations for schema */
if (!CONFIG.VALIDATE_DB_SCHEMA) {
    const propertiesToInclude = ['type', 'ref'];
    userObj = rip(userObj, propertiesToInclude);
}

const userSchema = new Schema(
    userObj,
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

userSchema.methods = {
    matchPassword: function (password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

userSchema.pre('save', async function (this: IUserCreate) {
    this.password = await bcrypt.hash(this.password, CONFIG.B_CRYPT_ROUNDS);
})

/* userSchema.virtual('full_name').get(function (this: User) {
    return `${this.first_name} ${this.last_name}`;
}); */

const User = model('User', userSchema);

export default User;