import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import uploadImage from './pb.post'
import getImage from './pb.get'

router.post('/', isLoggedin, uploadImage);
router.get('/:pb', getImage);

export default router;