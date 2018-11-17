import User from '../../../models/User';
import {userRegExp, emailRegExp } from '../../../config/regex';
import async from 'async';
import jwt from 'jsonwebtoken';

export function checkRegExp(req, res, next) {

    const { username, fullname, email, password } = req.body;
    let errors = [];

    if(!username || !userRegExp.test(username)) errors.push("ERR_USERNAME_INVALID");

    //if(!email || !emailRegExp.test(email)) errors.push("ERR_EMAIL_INVALID");

    if(!fullname || fullname.length < 3) errors.push("ERR_FULLNAME_INVALID");

    if(!password || password.length < 3) errors.push("ERR_PASSWORD_TOO_SHORT");

    if(errors.length > 0) return res.status(400).json({ status: "error", error: errors});

    next();
}

export function checkAvailability(req, res, next) {

    const { username, fullname, email, password } = req.body;

    async.parallel({
        username: function(callback) {
            User.findByUsername(username)
                .exec((err, user) => {
                    if(err) return callback(err, false);
                    callback(null, !user);
                })
        },
        email: function(callback) {
            User.findByEmail(email)
                .exec((err, user) => {
                    if(err) return callback(err, false);
                    callback(null, !user);
                })
        }
    }, function(err, availability) {
        if(err) console.error(err);
        if(err) return res.status(500).json({status: "error", error: "server side error"});

        let unaviable = [];
        if(!availability.username) unaviable.push("ERR_USERNAME_EXISTS");
        //if(!availability.email) unaviable.push("ERR_EMAIL_EXISTS");

        if(unaviable.length > 0) return res.status(409).json({status: "error", error: unaviable});
      
        next();
    });
}


export function registerUser(req, res, next) {

    const { username, fullname, email, password } = req.body;

    let user = new User({
        username: username,
        fullname: fullname,
        //email: { address: email},
        auth: { password: password}
    });

    user.save()
        .then(createdUser => {

            let users = {
                username: user.username,
                fullname: user.fullname,
                meta: user._doc.meta,
            }

            jwt.sign({id: createdUser._id}, 'lucalucaluca', (err, token) => {
                res.status(201).json({status: "ok", token: token, user: users});
            })
        })
        .catch(err => {
            res.status(500).json({status: "error", error: "server side error"});
            console.error(err);
        })

}