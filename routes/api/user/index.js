import express from 'express';
const router = express.Router();

import isLoggedin from '../../../middlewares/isLoggedin';

import { checkRegExp, checkAvailability, registerUser } from './user.post';
import {checkUser, getUser} from './user.get';
import { editUser, updateUser } from './user.put';
import deleteUser from './user.delete';

router.post('/', checkRegExp, checkAvailability, registerUser);
router.get('/:username?', checkUser, getUser);
router.put('/', isLoggedin, editUser, updateUser);
router.delete('/', isLoggedin, deleteUser);

export default router;