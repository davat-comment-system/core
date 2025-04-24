import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment.model';
import {IUser, UserModel} from '../models/User.model';


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .sort({ createdAt: -1 })
            .lean();

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};