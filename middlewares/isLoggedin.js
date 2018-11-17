export default function (req, res, next) {

    if(req.isLoggedin) return next();
    return res.status(401).json({status: 'error', msg: 'not logged in'});
};