import passport from '../passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Guest from "../models/Guest";


function authPropToReq(req, res, next) {
    
    let loggedin = function(e, bool) {
        if(e) throw e;
        req.isLoggedin = bool;
        next();
    };


    if(req.method === 'OPTIONS') return loggedin(null, false);

    const bearerHeader = req.headers['authorization'];

    if(!bearerHeader) {
        //Gast Vote
        if(req.cookies.guest){
            Guest.findByCookie(req.cookies.guest)
                .then(guest => {
                    if(!guest) return loggedin(null, false);
                    req.user = guest;
                    req.user.guest = true;
                    return loggedin(null, false);
                })
        } else {
            return loggedin(null, false);
        }
    } else {
        const token = bearerHeader.split(' ')[1];

        if(!token) return loggedin(null, false);
    
        jwt.verify(token, 'lucalucaluca', (err, data) => {
            if(err){
                //console.error(err);
                return res.status(403).json({error: "invalid token"});
            }
            User.findById(data.id)
                .select('username fullname email uuid meta')
                .then(user => {
                    if(!user) return res.status(401).json({error: "unauthsisiert"});
                    req.user = user;
                    loggedin(null, true);
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).end('error');
                })
        })
    }

    
}

export default function(){
    return authPropToReq;
};