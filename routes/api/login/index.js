import express from 'express';
const router = express.Router();

import login from './login.post';
import loginState from './login.get';

router.post('/', login);
router.get('/', loginState);

export default router;