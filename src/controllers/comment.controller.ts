import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment.model';
import {IUser, UserModel} from '../models/User.model';


export const createComment = async (req: Request, res: Response) => {

    try {
        const { content, parentId, userId } = req.body;

        const user = await UserModel.findOne({_id: userId});
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const parentComment = await CommentModel.findOne({_id: parentId});
        const comment = new CommentModel({
            content,
            userId: user._id,
            parentId: parentComment?._id || null
        });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



export const getComments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // get comments without parentId
        const comments = await CommentModel.find({ parentId: null })
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // find replies for comments
        const commentIds = comments.map((c) => c._id);
        const replies = await CommentModel.find({ parentId: { $in: commentIds } })
            .populate('userId', 'username')
            .sort({ createdAt: 1 })
            .lean();

        // connect
        const commentsWithReplies = comments.map((comment) => ({
            ...comment,
            replies: replies.filter((r) => r.parentId?.toString() === comment._id.toString())
        }));

        res.json(commentsWithReplies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await UserModel.findOne() as IUser;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }


        const comment = await CommentModel.findById(id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }


        const userIdStr = user._id.toString();
        const isLiked = comment.likes.some((u) => u.toString() === userIdStr);

        if (isLiked) {
            comment.likes = comment.likes.filter((u) => u.toString() !== userIdStr);
        } else {
            comment.likes.push(user._id);
        }

        await comment.save();

        res.json({
            liked: !isLiked,
            totalLikes: comment.likes.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};