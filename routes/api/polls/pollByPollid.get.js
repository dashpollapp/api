import Poll from '../../../models/Poll';
import Vote from '../../../models/Vote';

var mongoose = require('mongoose');
import {ObjectID} from '../../../lib/db';
import db from "../../../lib/mongo";

export default function(req, res, next){

    if(!mongoose.Types.ObjectId.isValid(req.params.pollid)) return res.status(400).json("ERR_INVALID_POLLID");

    Poll.findById(req.params.pollid)
        .populate('author', 'username fullname pb _id')
        .select('_id pollid heading polltype text maxVotes category date answers media createdAt') //
        .then(doc => {
            if(!doc) return res.status(404).json("ERR_POLL_NOT_FOUND");
            let tasks;
            
            switch(doc.polltype){
                case 10:
                    // [allVotes, hasVoted]
                    tasks = [
                        new Promise(resolve => {
                            Vote.getTotal(doc._id)
                            .then(num => resolve(num))
                        }),                       
                        
                        new Promise(resolve => {
                            if(!req.isLoggedin && !req.user) resolve(false);
                            Vote.findOne({pollid: doc._id, voter: req.user._id, choice: 1})
                                .then(voted => (voted) ? resolve(true) : resolve(false))
                        })]
                    

                    break;
                case 11:
                
                    // [likes, dislikes, hasVoted]
                    tasks = [
                        new Promise(resolve => {
                            Vote.count({pollid: doc._id, choice: 1})
                            .then(num => resolve(num))
                        }),

                        new Promise(resolve => {
                            Vote.count({pollid: doc._id, choice: 0})
                            .then(num => resolve(num))
                        }),                     
                        
                        new Promise(resolve => {
                            if(!req.isLoggedin && !req.user) resolve(false);
                            Vote.findOne({pollid: doc._id, voter: req.user._id})
                                .then(voted => (voted && typeof voted.choice === typeof 1) ? resolve(voted.choice) : resolve(false))
                        })]
                        break;
                    case 20:
                    // [hasVoted, totalVotes, totalVoter,  votes ]
                    tasks = [
                        new Promise(resolve => {
                            if(!req.isLoggedin && !req.user) return resolve(false);
                            Vote.findOne({pollid: doc._id, voter: req.user._id})
                                .then(voted => {
                                    let hasVoted = false;
                                    if(voted && voted.choice){
                                        if(voted.choice.length >= 1) hasVoted = true;
                                    }
                                    resolve(hasVoted ? voted.choice : false)})
                        }),

                        new Promise(resolve => {
                            Vote.find({pollid: doc._id})
                                .then(num => {
                                    let totalVotes = 0;
                                    num.forEach(vote => {
                                        if(typeof vote.choice === typeof []){
                                            totalVotes += vote.choice.length;
                                        }
                                    });
                                    resolve(totalVotes);

                                })
                        }),

                        new Promise(resolve => {
                            Vote.count({pollid: doc._id, choice: { $exists: true, $not: {$size: 0} }})
                                .then(num => resolve(num))
                        }),

                        
                        new Promise(resolve => {

                            var stimmen = {};                            
                            let run = 0;

                            doc._doc.answers.forEach((d, i) => {
                                Vote.find({pollid: doc._id, choice: i}).count()
                                    .then(num => {
                                        stimmen[i] = num;
                                        run++;
                                        if(doc._doc.answers.length === run) resolve(stimmen);
                                    })                              
                                })
                            })
                    ]
                        break;
                default:
                        tasks = []
                        break;
                
                }
                
                Promise.all(tasks)
                    .then(vote => {
                        
                      
                        switch(doc.polltype){
                            case 10:
                                doc._doc.vote = {
                                    hasVoted: vote[1],
                                    totalVotes: vote[0]
                                }
                                break;
                            case 11:
                                doc._doc.vote = {
                                    likes: vote[0],
                                    dislikes: vote[1],
                                    hasVoted: vote[2]
                                }
                                break;
                            case 20:
                                // [hasVoted, totalVotes, totalVoter,  votes ]
                                doc._doc.vote = {
                                    hasVoted: vote[0],
                                    totalVotes: vote[1],
                                    totalVoter: vote[2],
                                    votes: vote[3]
                                }
                            default:
                                break;    
                        }

                        res.json(doc);
                    })


        })
}
