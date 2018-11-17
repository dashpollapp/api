const async = require('async');
import db from '../lib/db';

module.exports = (username, email) => {

    return new Promise((resolve, reject) => {

        const users = db().collection('users');

        async.parallel({

            username: function(callback) {

                users.findOne({ username: username}, (err,data) => {
                    if(err) throw err;
                    if(data){
                        callback(null, 'exists');
                    } else {
                        callback(null, false);
                    }
                });

            },

            email: function(callback) {

                users.findOne({ "email.address": email, "email.verified": true}, (err,data) => {
                    if(err) throw err;
                    if(data){
                        callback(null, 'exists');
                    } else {
                        callback(null, false);
                    }
                });

            },

        }, function(err, results) {
            resolve(results);
        });
    });
};