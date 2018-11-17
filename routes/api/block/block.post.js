import Relation from '../../../models/Relation';
import User from '../../../models/User';
import { resolve } from 'path';

export default function(req, res, next){

    const { target } = req.body;

    //Get target from DB
    User.findById(target)
        .select("_id username fullname meta")
        .then(user => {

            //Check if Target Exists
            if(!user) return res.status(404).json({error: "ERR_TARGET_NOT_FOUND"});

            if(user._id.equals(req.user._id)) return res.status(400).json("ERR_CANT_BLOCK_SELF");

            Promise.all([blockUser(req.user._id, user._id), letTargetUnfollowSource(user._id, req.user._id)])
                .then(() => res.json({
                    status: "SUCCESS",
                    target: user
                }));
        
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: "ERR_SERVER_SIDE"});
        })
    }

//set blocked true and following false
function blockUser(source, target){
    return new Promise((resolve, reject) => {
        Relation.update({source, target },
            {$set: { blocked: true, following: false }},
            {upsert: true})
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

//set following false for the target (blocked) user
//source and target reverse
function letTargetUnfollowSource(source, target){
    return new Promise((resolve, reject) => {
        Relation.update({target, source},
            {$set: { following: false }},
            {upsert: true})
            .then(() => resolve())
            .catch(err => reject(err))
    })
}