import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import explore from './explore.get';

router.get('/', explore);

export default router;