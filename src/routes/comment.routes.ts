import { Router } from 'express';
import {createComment, getComments, toggleLike} from '../controllers/comment.controller';

const router = Router();

router.post('/', createComment);
router.get('/', getComments);
router.post('/:id/like', toggleLike);


export default router;
