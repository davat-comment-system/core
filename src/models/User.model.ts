import {Schema, model, Document, Types} from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true }
});

export const UserModel = model<IUser>('User', userSchema);
//