import { Strategy as BearerStrategy } from 'passport-http-bearer';
import User from '../../models/User';


export default new BearerStrategy({ passReqToCallback: true},
    function(req, token, done) {
        User.findByUuid(token)
            .then(user => {
                if(!user) return done(null, false);
                req.user = user;
                return done(null, user);
            })
            .catch(err => {
                console.log(err);
                return done(null, false);
            })
        }
)
