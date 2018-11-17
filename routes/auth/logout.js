const express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.isLoggedin){
       return res.json({msg: 'you are not logged in! you need to log in to log out!'})
    }

    console.log(req.user);

    req.logout();
    res.json({status: 'successfully logged out'});
    req.session.destroy(function (err) {
        if(err) throw err;
        console.log(req.user);
    });

});

module.exports = router;