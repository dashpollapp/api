const sha = require("crypto-js/sha512");

module.exports = function(password){
    return sha(password).toString();
};