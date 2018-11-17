const visibility = {

    "Alle": 0,
    "Meine Follower": 1,
    "Niemand": 2,

};

module.exports = (vis) => {
    return visibility[vis];
};