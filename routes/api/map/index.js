import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

router.get('/', isLoggedin);

export default router;