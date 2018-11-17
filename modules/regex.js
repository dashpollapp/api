module.exports = {

    /*
    - Nur alphanumerische, unterstrich und punkt
    - unterstrich und punkt nicht nebeneinander
    - unterstrich und punkt nicht am anfang oder ende
    - zwischen 4 und 16 zeichen lang
    */
    username: (username) => {
        return /^([a-zA-Z0-9_.]){3,16}$/.test(username);
    },

    email: (email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
};