import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import {getMsgs} from './chats.get';
import {uploadeImage, sendMsgs} from './chats.post'

router.get('/', isLoggedin, getMsgs);
router.post('/', isLoggedin, sendMsgs);
router.post('/image', isLoggedin, uploadeImage);

export default router;