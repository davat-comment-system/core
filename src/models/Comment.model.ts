import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
    _id: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    likes: Types.ObjectId[];
    parentId?: Types.ObjectId;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, default: Date.now }
});

export const CommentModel = model<IComment>('Comment', commentSchema);
//