import User from '../../../models/User';
import { emailRegExp } from '../../../config/regex';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export default function login(req, res, next){

    const { username, password } = req.body;
    
    getUser(username)
        .then(user => {
            if(!user) return res.status(401).json({error: "ERR_INVALID_CREDENTIALS"});

            const hash = crypto.createHash('sha512').update(password + user.auth.salt).digest("hex");

            if(hash === user.auth.password){
                //Erfolgreich eingeloggt

                let users = {
                    username: user.username,
                    fullname: user.fullname,
                    meta: user._doc.meta,
                }

                jwt.sign({id: user._id}, 'lucalucaluca', (err, token) => {
                    return res.status(200).json({status: "SUCCESSFULLY_LOGGED_IN", token: token, user: users});
                })


            } else {
                return res.status(401).json({status: "ERR_INVALID_CREDENTIALS"});
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: "server side error"});
        })

    

}

function getUser(username){
    return new Promise((resolve, reject) => {
        if(emailRegExp.test(username)){

            User.findByEmail(username)
                .then(user => resolve(user))
                .catch(err => reject(err))
        } else {
            
            User.findByUsername(username)
                .then(user => resolve(user))
                .catch(err => reject(err));
        }
    })
}