const async = require('async');
import db from '../../lib/db';

function check(username, email) {

    return new Promise((resolve, reject) => {

        const users = db().collection('users');
        async.parallel({

            username: function(callback) {
                users.findOne(
                    {username:{'$regex': '^' + username + '$', '$options': 'i'}}
                , (err,data) => {
                    callback(err, (!!data));
                });
            },

            email: function(callback) {
                users.findOne(
                    {"email.address" :{'$regex': '^' + email + '$', '$options': 'i'}}
                , (err,data) => {
                    callback(err, (!!data));
                });
            }

        }, function(err, results) {
            if(err) throw err;
            resolve(results.username, results.email);
        });
    });
}


module.exports = (u, req, res, next) => {

    check(u.username, u.email)

        .then((result) => {
            console.log(result);

            if(result.username){
                res.json({status: 'error', msg: 'Dieser Username existiert bereits', code: 3});
                return;
            }

            if(result.email){
                res.json({status: 'error', msg: 'Diese E-Mail wird schon verwendet', code: 4});
                return;
            }

            return next(u);

        })
};

module.exports.check = check;