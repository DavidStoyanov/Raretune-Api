import { Schema, model } from 'mongoose';

const tokenBlacklistObj = {
    token: String
}

const tokenBlacklistSchema = new Schema(
    tokenBlacklistObj,
    {
        timestamps: {
            createdAt: 'created_at',
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

const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);

export default TokenBlacklist;