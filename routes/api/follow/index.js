import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import follow from './follow.post'
import unfollow from './follow.delete'

router.post('/', isLoggedin, follow);
router.delete('/', isLoggedin, unfollow);

export default router;