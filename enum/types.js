const types = {

    "Like's": 0,
    "5 Sterne": 1,
    "Daumen hoch/runter": 2,
    "Battle":  3,
    "Emoji's": 4,
    "spam4me": 5,
    "Klassische Umfrage": 6,
    "Mehrfach Auswahl": 7,
    "Liste": 8,

};

module.exports = (type) => {
    return types[type];
};