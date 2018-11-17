import { Strategy as LocalStrategy } from 'passport-local';
import db, { ObjectID } from '../../lib/db';
import regex from '../../modules/regex';
import hash from '../../modules/hash';

export default new LocalStrategy(
    {
        usernameField: 'user',
        passwordField: 'password',
    },
    function (username, password, done) {

        if(!regex.username(username) && !regex.email(username)) return done(null, false);

        let users = db().collection('users'),
            query = regex.email(username)
                ? { "email.address": username, "email.verified": true, password: hash(password)}
                : { "username": {'$regex': '^' + username + '$', '$options': 'i'}, "password": hash(password)};

        users.findOne(query, (err,user) =>{
            if(err) throw done(err, false);
            //Login erfolgreich
            if(user){
                //Ob die Email überprüft ist
                /*if(!data.email.verified){
                    return res.json({status: 'failed', msg: 'email not verified'});
                }*/
                return done(null, user);
            } else {
                
                //Login fehlgeschlagen
                return done(null, false);
            }
        });

    }
)