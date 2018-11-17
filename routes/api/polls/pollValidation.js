"use strict";

const allowedTypes = [0, 10, 11, 12, 20];
const allowedCategories = ["policy", "news"];
const allowedMedias = ["spotify", "youtube", "image"];

export default function(req, res, next){

    
    const {heading, text, polltype, category, media, answers = [], maxVotes } = req.body;


    let errors = [];

    //Heading required, string
    if(!heading || typeof heading !== typeof "") errors.push("ERR_HEADING_MISSING");
    if(typeof heading === typeof ""){
        if(heading.length > 1024 || heading.length < 1) errors.push("ERR_HEADING_TOO_LONG_OR_SHORT");
    }
    
    //Polltype required, number
    if(!allowedTypes.includes(polltype)) errors.push("ERR_POLLTYPE_NOT_FOUND");

    //Category optional
    if(category && !allowedCategories.includes(category)) errors.push("ERR_CATEGORY_NOT_FOUND");

    //Text optional, string
    if(text){
        if(typeof text !== typeof ""){
            errors.push("ERR_TEXT_MUST_BE_STRING");
        } else {
            if(text.length < 2 || text.length > 1024) errors.push("ERR_TEXT_TOO_LONG_OR_SHORT");
        }
    }

    //Media optional, object
    if(media){
        if(typeof media !== typeof {}){ errors.push("ERR_MEDIA_MUST_BE_OBJECT") } else {
            if(!allowedMedias.includes(media.type)) errors.push("ERR_MEDIA_INVALID");
            //Parsing YouTube / Spotify URIs
            if(media.type === "youtube" && !/^([a-zA-Z0-9_-]){11}$/.test(media.uri)) errors.push("ERR_YOUTUBE_ID_INVALID");
            if(media.type === "spotify" && !/^([a-zA-Z0-9]){22}$/.test(media.uri)) errors.push("ERR_SPOTIFY_ID_INVALID");
        } 
    }

    if(polltype === 20) {
        if(answers.length === 0 ) errors.push("ERR_ANSWERS_MISSING");
        if(answers.length > 10) errors.push("ERR_ANSWERS_EXEEDED");
        if(answers.length > 0 && answers.length <= 10){
            answers.forEach((answer, i) => {
                if(typeof answer !== typeof ""){ errors.push("ERR_ANSWER_" + i + "_MUST_BE_STRING") } else {
                    if(answer.length < 1 || answer.length > 255) errors.push("ERR_ANSWER_" + i + "_TOO_LONG_OR_SHORT");
                }
            });
        };
        if(!maxVotes || typeof maxVotes !== typeof 1) {errors.push("ERR_MAXVOTES_INVALID")} else {
            if(maxVotes < 1 || maxVotes > answers.length) errors.push("ERR_MAXVOTES_INVALID");
        }
    }
    console.log(errors);
    if(errors.length > 0) return res.status(400).json(errors);
    next();

}