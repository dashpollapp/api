import Relation from '../../../models/Relation';
import User from '../../../models/User';

export default function follow(req, res, next){

    const { target } = req.body;
    

    //Get target from DB
    User.findById(target)
        .select("_id username fullname meta")
        .then(user => {

            //Check if Target Exists
            if(!user) return res.status(404).json({error: "ERR_TARGET_NOT_FOUND"});

            if(user._id.equals(req.user._id)) return res.status(400).json("ERR_CANT_FOLLOW_SELF");

            //Check if one is blocked
            Relation.findBlock(user._id, req.user._id)
            .then(blocked => {

                if(blocked.self) return res.status(404).json('ERR_BLOCK_BY_SELF')
                if(blocked.target) return res.status(404).json('ERR_BLOCK_BY_TARGET')

                //Follow Object
                let follow = {
                    source: req.user._id,
                    target: user._id,
                    following: true,
                }

                //Update / Create Follow in DB
                Relation.update({source: req.user._id, target: user._id},
                {$set: follow},
                {upsert: true})
                .then(() => res.json({
                    status: "SUCCESS",
                    target: user
                }));

            })
        
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: "ERR_SERVER_SIDE"});
        })
    }