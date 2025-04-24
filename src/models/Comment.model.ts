import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
    _id: Types.ObjectId;
    content: string;
    user: Types.ObjectId;
    likes: Types.ObjectId[];
    likeCount: number;
    isLiked: boolean;
    parent?: Types.ObjectId;
    replies?: IComment[];
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, default: Date.now }
});


export const CommentModel = model<IComment>('Comment', commentSchema);
//