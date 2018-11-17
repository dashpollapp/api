const express = require('express'),
    getPb = require('../../functions/getPb'),
    router = express.Router();

import passport from '../../passport';

router.post('/', function(req, res, next) {
    
    passport.authenticate('local-login', function(err, user, msg) {
        console.log(req.body);
        if (err) throw err;
        console.log(msg);

        if (!user) {
            return res.json({
                status: 'error',
                msg: 'invalid password'
            });
        }

        req.logIn(user, async function(err) {
            if (err) { throw err; }
            return res.json({
                status: 'ok',
                href: '/',
                session: user._id,
                user: {
                    username: req.user.username,
                    fullname: req.user.fullname,
                    email:  req.user.email.address,
                    color:  req.user.color,
                    verified: req.user.verified || false,
                    pb: await getPb(user._id),
                    tagline: req.user.tagline,
                    website: req.user.website
                }
            })
        });
    })(req, res, next);
});

module.exports = router;