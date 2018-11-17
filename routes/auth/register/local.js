import express from 'express';
import passport from '../../../passport';
const router = express.Router();


router.post('/', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err) }
        console.log(info);

        if (!user || (!!info)) {
            return res.json({
                status: 'error',
                error: info.error
            })
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
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
                    pb: req.user.pb || 'default',
                    tagline: req.user.tagline,
                    website: req.user.website
                }
            })
        });
    })(req, res, next);
});


module.exports = router;