const express = require('express'),
    getPb = require('../../functions/getPb'),
    router = express.Router();

import passport from '../../passport';

router.get('/', async function(req, res, next) {
    const responseObj = {
        loggedin: req.isLoggedin
    };
    if(req.isLoggedin) {
        responseObj.user = {
            username: req.user.username,
            fullname: req.user.fullname,
            email:  req.user.email.address,
            color:  req.user.color,
            verified: req.user.verified || false,
            pb: await getPb(req.user._id),
            tagline: req.user.tagline,
            website: req.user.website
        }
    }

    res.status((!req.isLoggedin) ? 401 : 200).json(responseObj);

});

module.exports = router;
