import User from '../../../models/User';
import Poll from '../../../models/Poll';
import Vote from '../../../models/Vote';
import Relation from '../../../models/Relation';
import async from 'async';

import {ObjectID} from '../../../lib/db';

const allowedSites = ["home", "trends","all"];
export function buildQuery(req, res, next){

    let query = {};
    const { category, user, site, date } = req.query;

    //Check if Site and Category is Allowed 
    if(site && !allowedSites.includes(site)) return res.status(400).json({error: "ERR_SITE_NOT_FOUND"});
    if(site === "home" && !req.isLoggedin) return res.status(401).json({error: "ERR_NOT_LOGGED_IN"});
    if(!site) return res.status(400).json({error: "ERR_SITE_NOT_FOUND"});
    //if(category && !allowedCategories.includes(category)) return res.status(404).json({error: "ERR_CATRGORY_NOT_FOUND"});

    //Check if user or site entered
    if(user && site) return res.status(400).json({error: "man kann nicht seite und user beides angeben"});

    //synchron
    if(category) {
        query.category = parseInt(category);
    }   

    if(date) {
        query.createdAt = {$gte : date}
        console.log(date)
    }

    if(site) {
        switch(site) {
            case 'home':

                let test = [];

                Relation.find({source: req.user._id, following: true})
                .then(d => {
                    d.forEach(d => {
                        test.push(d.target);
                    })  
                    query.author = test;
                    next(query);                    
                })

            break;
            case 'trends':
                query.author = ObjectID("5b09c89312574128e4acb285");
                next(query);
            break;

	  case 'all':
		next(query);
		break;
        }
    }
    //asynchron
    if(user){
        //Get User from Database
        User.findByUsername(user)
        .then(user => {
            //Check if User exists
            if(!user) return res.status(404).json({error: "user no found"});
            query.author = user._id;
            next(query);
        })
        .catch(err => {
            //Render Error if exists
            console.error(err);
            return res.status(500).json({error: "error"});
        })
    }
}

export function getPolls(query, req, res, next){

    //Set limit and skip to default value if not exists
    let { limit = 10, skip = 0 } = req.query;

    //Parse limit and skip to Int
    limit = parseInt(limit);
    skip = parseInt(skip);

    //Check if Skip and Limit is allowed
    //if(skip < 0 || limit < 0 || limit > 25 || (skip % 1 !== 0) || (limit % 1 !== 0)) return res.status(400).json({error: "AN <3"});

    console.log(query);

    //Get Polls from Database
    Poll.find(query)
        .populate('author', 'username fullname pb -_id')
        .limit(limit)
        .skip(skip)
        .select('_id pollid heading polltype category date answers media createdAt')
        .then(polls => (polls.length !== 0) ? lookupVotes(polls, req) : {error: 'ERR_NO_POLLS_FOUND'})
        .then(polls => {
            //Render Polls as JSON
            res.json(polls);
        })
        .catch(err => {
            //Render Error if exists
            console.error(err);
            //return res.status(500).json({error: 500});
        })
}

export function getOnePoll(req, res, next) {

    Poll.find({pollid: req.params.poll})
        .populate('author', 'username fullname pb -_id')
        .select('_id pollid heading polltype text category date answers media createdAt') //DANKE LUCA <3
        .then(polls => (polls.length !== 0) ? lookupVotes(polls, req) : {error: 'ERR_NO_POLLS_FOUND'})
        .then(polls => {
            //Render Polls as JSON
            res.json(polls);
        })
        .catch(err => {
            //Render Error if exists
            console.error(err);
            return res.status(500).json({error: 500});
        })

}

function lookupVotes(polls, req){

    let run = 0;
    return new Promise((resolve, reject) => {

        polls.forEach(poll => {

            let tasks;
            //Switch Polltypes
            switch(poll.polltype) {

                //Polltype - Heart (11)
                case 10:

                    tasks = {

                        totalVotes: function(callback) {
                            Vote.getTotal(poll._id)
                                .then(num => callback(null, num))
                                .catch(err => callback(err));
                        },

                        hasVoted: function(callback) {
                            if(!req.isLoggedin) return callback(null, 'NOT_LOGGED_IN');
                            Vote.findOne({pollid: poll._id, voter: req.user._id, choice: 1})
                                .then(voted => (voted) ? callback(null, true) : callback(null, false))
                                .catch(err => callback(err));
                        }
                    }

                break;

                case 11:

                    tasks = {

                        votesUp: function(callback) {
                            Vote.find({pollid: poll._id, choice: 1}).count()
                                .then(num => callback(null, num))
                                .catch(err => callback(err));
                        },

                        votesDown: function(callback) {
                            Vote.find({pollid: poll._id, choice: 0}).count()
                            .then(num => callback(null, num))
                            .catch(err => callback(err));
                        },

                        hasVoted: function(callback) {
                            if(!req.isLoggedin) return callback(null, 'NOT_LOGGED_IN');
                            Vote.findOne({pollid: poll._id, voter: req.user._id})
                                .then(voted => callback(null, (voted) ? voted.choice : false))
                                .catch(err => callback(err));
                        }

                    }

                break;

                case 16:

                tasks = {

                    votesLeft: function(callback) {
                        Vote.find({pollid: poll._id, choice: 0}).count()
                        .then(num => callback(null, num))
                        .catch(err => callback(err));
                    },

                    votesRight: function(callback) {
                        Vote.find({pollid: poll._id, choice: 1}).count()
                            .then(num => callback(null, num))
                            .catch(err => callback(err));
                    },

                    hasVoted: function(callback) {
                        if(!req.isLoggedin) return callback(null, 'NOT_LOGGED_IN');
                        Vote.findOne({pollid: poll._id, voter: req.user._id})
                            .then(voted => callback(null, (voted) ? voted.choice : false))
                            .catch(err => callback(err));
                    }

                }

                break;

                case 20:

                    tasks = {

                        hasVoted: function(callback) {
                            if(!req.isLoggedin) return callback(null, 'NOT_LOGGED_IN');
                            Vote.findOne({pollid: poll._id, voter: req.user._id})
                                .then(voted => callback(null, (voted) ? voted.choice : false))
                                .catch(err => callback(err));
                        },

                        totalVotes: function(callback) {
                            Vote.getTotal(poll._id)
                                .then(num => callback(null, num))
                                .catch(err => callback(err));
                        },


                        votes: function(callback) {

                            var stimmen = {};
                            
                            let run = 0;

                            Vote.find({pollid: poll._id})

                            .then(data => {

                                poll._doc.answers.forEach((d, i) => {

                                    Vote.find({pollid: poll._id, choice: i}).count()

                                    .then(num => {
                                        stimmen[i] = num;
                                        run++;
                                        if(poll._doc.answers.length === run) callback(null, stimmen);
                                    })
                                                             
                                })
                                
                            })
                        
                        }

                    }

                break;

                default:
                    tasks = {
                        test: cb => cb(null)
                    }
                break;
            }

            async.parallel(tasks, (err, result) => {
                if(err) console.error(err);
                delete poll._doc._id;
                switch(poll.polltype) {
                    case 11: 
                        poll._doc.vote = {
                            hasVoted: result.hasVoted,
                            totalVotes: result.totalVotes
                        }
                    break;
                    case 12:
                        poll._doc.vote = {
                            hasVoted: result.hasVoted,
                            totalVotes: result.votesDown + result.votesUp,
                            0: result.votesDown,
                            1: result.votesUp,
                        }
                    break;
                    case 16:
                        poll._doc.vote = {
                            hasVoted: result.hasVoted,
                            totalVotes: result.votesLeft + result.votesRight,
                            0: result.votesLeft,
                            1: result.votesRight,
                        }
                    break;
                    case 21:
                        poll._doc.vote = {
                            hasVoted: result.hasVoted,
                            totalVotes: result.totalVotes,
                            votes: result.votes
                        }
                    break;
                    }
                
                run++;
                if(run >= polls.length){
                    resolve(polls)
                }

            })

        })
    })
}

import sharp from 'sharp';

export function getImages(req, res, next) {

    let uri = req.params.uri;
    let type = req.query.type;

    switch(type) {
        case "image":

            sharp(__dirname + '/../../../uploads/polls/' + uri)
            .resize(1000, 1000)
            .background({r: 255, g: 255, b: 255, alpha: 1})
            .flatten()
            .webp()
            .toBuffer()
            .then((data) => {
                res.setHeader("Content-type", "image/webp");
                res.end(data);
            })
            .catch((err) => {
                res.json({error: 'ERR_NO_IMAGE_FOUND'});
            });

        break;
        case 'battle': 

            sharp(__dirname + '/../../../uploads/polls/' + uri)
            .resize(1000, 1000)
            .background({r: 255, g: 255, b: 255, alpha: 1})
            .flatten()
            .webp()
            .toBuffer()
            .then((data) => {
                res.setHeader("Content-type", "image/webp");
                res.end(data);
            })
            .catch((err) => {
                res.json({error: 'ERR_NO_IMAGE_FOUND'});
            });

        break;
        default:
            res.json({error: 'NO_TYPE_FOUND'});
        break;

    }

}
