import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import block from './block.post'
import unblock from './block.delete'

router.post('/', isLoggedin, block);
router.delete('/', isLoggedin, unblock);

export default router;