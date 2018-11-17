import { Strategy as LocalStrategy } from 'passport-local';
import regex from '../../modules/regex';
import { check as exists } from '../../modules/register/checkExists';
import hash from '../../modules/hash';
import randomstring from 'randomstring';
import db, { ObjectID } from '../../lib/db';

export default new LocalStrategy(
    //Options object
    {
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {

        let u = req.body;

        if(!regex.username(u.username)) return done(null, false, { error: 1 });
        if(!regex.email(u.email)) return done(null, false, { error: 2 });

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            exists(u.username, u.email)
                .then((userExists, emailExists) => {
                    if(userExists) return done(null, false, { status: 3});
                    if(emailExists) return done(null, false, { status: 4});

                    //Jetzt müssen ma den User speichern
                    let users = db().collection('users'),
                        uuid = randomstring.generate(16);

                    let user = {
                        "uuid": uuid,
                        "username": u.username,
                        "fullname": u.fullname,
                        "email": { "address": u.email, "verified": false},
                        "password": hash(u.password),
                        "date": Date.now() / 1000 | 0
                    };

                    users.insert(user, function(err){
                        if(err) return done(err, false, { status: 5});
                        //verifyEmail(uuid, u.email, u.fullname);
                        return done(null, user);
                    });
                });
        });
    }
)