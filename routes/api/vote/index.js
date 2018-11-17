import express from 'express';
const router = express.Router();
import db from "../../../lib/mongo";
import crypto from "crypto";
import Guest from "../../../models/Guest";

//import isLoggedin from '../../../middlewares/isLoggedin';

import {checkAvailability, vote} from './vote.post';
import { delvote } from './vote.delete';

router.post('/', initGuestUser, checkAvailability, vote);
router.delete('/', delVoteMustInitBefore, checkAvailability, delvote);

export default router;

function delVoteMustInitBefore(req, res, next){
    if(req.isLoggedin || req.user) return next();
    return res.status(401).json("ERR_MUST_VOTE_BEFORE_DELETE");
}

function initGuestUser(req, res, next){

    if(req.isLoggedin) return next();

    if(req.user){
        if(req.user.guest) return next();
    }

    Guest.findByIp(req.headers["x-real-ip"] || req.connection.remoteAddress)
        .then(guests => {
            if(guests && guests.length > 99) return res.status(400).json("ERR_LIMIT_IP"); //99 votes pro IP erlaubt 


            const cookie = crypto.randomBytes(16).toString('hex'),
                ip = req.headers["x-real-ip"] || req.connection.remoteAddress,
                ref = req.headers.referer,
                userAgent = req.headers['user-agent'];

            const guest = new Guest({ cookie, ip, ref, userAgent });

            guest.save()
                .then(doc => {
                    req.user = doc;
                    res.cookie('guest', doc.cookie, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
                    next();
                });
        })

}
