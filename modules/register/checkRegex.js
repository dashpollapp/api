const regex = require('../regex');

module.exports = function (req, res, next) {

    let u = req.body;

    if(!regex.username(u.username)){
        res.json({status: 'error', msg: 'Ungültiger Username', code: 1});
        return;
    }

    if(!regex.email(u.email)){
        res.json({status: 'error', msg: 'Ungültige E-Mail', code: 2});
        return;
    }

    return next(u);
};