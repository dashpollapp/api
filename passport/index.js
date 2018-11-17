import passport from 'passport';
import User from '../models/User';

import bearerLogin from './strategies/bearerLogin';
import localLogin from './strategies/localLogin';
import localSignup from './strategies/localSignup';

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .exec((err, user) => done(err, user));
    })

    passport.use('bearer-login', bearerLogin);
    passport.use('local-signup', localSignup);
    passport.use('local-login', localLogin);

export default passport;