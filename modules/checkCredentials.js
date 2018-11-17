const hash = require('../modules/hash'),
    regex = require('../modules/regex'),
    email = require('../modules/email');

import db from '../lib/db';

module.exports = (req, res, next) => {

    let username = req.body.user,
        password = req.body.password;

    if(!regex.username(username) && !regex.email(username)){
        res.json({
            status: 'error',
            msg: 'invalid username or E-Mail'
        });
        return;
    }
    if(password.length < 4 || password.length > 64){
        res.json({
            status: 'error',
            msg: 'invalid password'
        });
        return;
    }

    const users = db().collection('users');

    //Falls der sich mit E-Mail einloggt

    if(regex.email(username)){
        var query = { "email.address": username, "email.verified": true, password: hash(password)};
    } else {
        var query = { "username": {'$regex': '^' + username + '$', '$options': 'i'}, "password": hash(password)};
    }

    users.findOne(query, (err,data) =>{
        if(err) throw err;
        //Login erfolgreich
        if(data){
            //Ob die Email überprüft ist
            /*if(!data.email.verified){
                return res.json({status: 'failed', msg: 'email not verified'});
            }*/

            email.loginEmail('Dashpoll >> Erfolgreich','Username: ' + username);
            return next(data);

        } else {

            //Login fehlgeschlagen
            email.loginEmail('Dashpoll >> Fehlgeschlagen','Username: ' + username);
            res.json({
                status: 'error',
                msg: 'invalid login'
            });
            return;
        }
    });


};