import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import { buildQuery, getPolls, getImages, getOnePoll } from './polls.get';
import { createPoll } from './polls.post';
import pollValidation from "./pollValidation";
import getByPollid from "./pollByPollid.get";

router.get('/', buildQuery, getPolls);
router.get('/:pollid', getByPollid);
router.get('/image/:uri', getImages);
router.post('/', isLoggedin, pollValidation, createPoll);

export default router;