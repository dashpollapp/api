import Relation from '../../../models/Relation';
import User from '../../../models/User';

export default function unfollow(req, res, next){

    const { target } = req.body;

    //Check if Target Exists
    User.findById(target)
        .select("_id username fullname meta")
        .then(user => {

            //Check if Target exists
            if(!user) return res.status(404).json({error: "ERR_USER_NOT_FOUND"});

            if(user._id.equals(req.user._id)) return res.status(400).json("ERR_CANT_FOLLOW_SELF");

            Relation.update(
                { source: req.user._id, target: user._id },
                { $set: { following: false } })
            .then(() => res.json({
                status: "SUCCESS",
                target: user
            }));

        })
        .catch(err => {
            //Render ERROR if exists
            console.error(err);
            res.status(500).json({error: "server error"});
        })
}