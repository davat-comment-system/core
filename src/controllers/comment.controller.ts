import {Request, Response} from 'express';
import {CommentModel} from '../models/Comment.model';
import {IUser, UserModel} from '../models/User.model';
import mongoose from "mongoose";


export const createComment = async (req: Request, res: Response) => {

    try {
        const {'x-user': _user} = req.headers;

        const {content, parent} = req.body;

        const user = await UserModel.findOne({_id: new mongoose.Types.ObjectId(_user as string)});
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const parentComment = await CommentModel.findOne({_id: parent});
        const comment = new CommentModel({
            content,
            user: user._id,
            parent: parentComment?._id || null
        });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};


export const getComments = async (req: Request, res: Response) => {
    try {
        const {'x-user': _user} = req.headers;

        const user = await UserModel.findOne({_id: new mongoose.Types.ObjectId(_user as string)});
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;


        const commentsWithReplies = await CommentModel.aggregate([
            // Stage 1: Get comments without parentId
            {
                $match: {parent: null}
            },
            // Stage 2: Add "isLiked" field to check if current user has liked the comment
            {
                $addFields: {
                    isLiked: {$in: [new mongoose.Types.ObjectId(_user as string), "$likes"]},
                    likeCount: { $size: "$likes" }
                }
            },
            // Stage 3: Sort comments by createdAt in descending order
            {
                $sort: {createdAt: -1}
            },
            // Stage 4: Skip and limit for pagination
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            // Stage 5: Lookup replies for each comment (using parent field)
            {
                $lookup: {
                    from: "comments",
                    let: {commentId: "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$parent", "$$commentId"]}}},
                        {
                            $addFields: {
                                isLiked: {$in: [new mongoose.Types.ObjectId(_user as string), "$likes"]},
                                likeCount: { $size: "$likes" }
                            }
                        },
                        {$sort: {createdAt: 1}},
                        {$lookup: {from: "users", localField: "user", foreignField: "_id", as: "user"}},
                        {$unwind: "$user"},
                        {$project: {likes: 0, parent: 0}},
                    ],
                    as: "replies"
                }
            },
            // Stage 6: Populate user data for the comment and its replies
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {$project: {likes: 0, parent: 0}},
        ]);

        res.json(commentsWithReplies);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};


export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    try {
        const {'x-user': _user} = req.headers;

        const {id} = req.params;

        const user = await UserModel.findOne({_id: new mongoose.Types.ObjectId(_user as string)});
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }


        const comment = await CommentModel.findById(id);
        if (!comment) {
            res.status(404).json({message: 'Comment not found'});
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
            isLiked: !isLiked,
            likeCount: comment.likes.length,
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};