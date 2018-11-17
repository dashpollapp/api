const kategorien = {

    "Politik": 0,
    "Technologie": 1,
    "Sport": 2,
    "Autos & Motoren": 3,
    "Wirtschaft": 4,
    "Promis": 5,
    "Wissenschaft": 6,
    "Essen": 7,
    "Gesundheit": 8,
    "Kunst": 9,
    "Unterhaltung": 10,
    "Reisen": 11,
    "Musik": 12,
    "Fotografie": 13,
    "Religion": 14,
    "Videospiele": 15,
    "Natur": 16,
    "Tiere": 17,
    "Beauty": 18,
    "Haushalt": 19,
    "Computer": 20,
    "News": 21

};

const category = {

    "policy": 1,
    "technology": 2,
    "sports": 3,
    "cars": 4,
    "business": 5,
    "news": 6,
    "celebrities": 7,
    "science": 8,
    "food": 9,
    "health": 10,
    "art": 11,
    "entertainment": 12,
    "traveling": 13,
    "music": 14,
    "photography": 15,
    "religion": 16,
    "videogames": 17,
    "nature": 18,
    "animals": 19,
    "beauty": 20,
    "budget": 21,
    "computers": 22

};

module.exports.deutsch = (cat) => {
    return kategorien[cat];
};

module.exports.english = (cat) => {
    return category[cat];
};