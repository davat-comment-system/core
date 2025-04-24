import {Schema, model, Document, Types} from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    fullName: string;
}

const userSchema = new Schema<IUser>({
    fullName: { type: String, required: true }
});

export const UserModel = model<IUser>('User', userSchema);
//