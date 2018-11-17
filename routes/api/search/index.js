import express from 'express';
const router = express.Router();

import search from './search.get';

router.get('/', search);

export default router;