import User from '../../../models/User';
import Relation from '../../../models/Relation';
import async from 'async';

export default function explore(req, res, next) {

    let tasks = {

        //Alphatester
        alphatester: function(callback) {

            //Get all User from Database
            User.find({}) // -> Database Query
            .sort({username: 1}) // -> Sort by ABC
            .select('-_id username fullname') // -> Get Username / Fullname and PB
            .then(d => {
                callback(null, d); // -> Callback (error / result)
            })

        }

    }

    //Check if User is Loggedin
    if(req.isLoggedin) {

        //Follower
        tasks.follower = function(callback) {

            //Get Follower from Database
            Relation.find({target: req.user._id, following: true}) // -> Database Query
            .populate('follower') // -> Get User by Follower ID
            .sort({username: 1}) // -> Sort by ABC
            .select('username fullname pb') // -> Get Username / Fullname and PB
            .then(d => {
                let follower = d.map(follwer => ({username: follwer.follower.username, fullname: follwer.follower.fullname}));
                callback(null, follower); // -> Callback (error / result)
            })
            
        },

        //Following
        tasks.following = function(callback) {

            //get Following from Database
            Relation.find({source: req.user._id, following: true}) // -> Database Query
            .populate('target') // -> Get User by Target ID
            .sort({username: 1}) // -> Sort by ABC
            .select('username fullname pb') // -> Get Username / Fullname and PB
            .then(d => {
                let following = d.map(targets => ({username: targets.target.username, fullname: targets.target.fullname}));
                callback(null, following); // -> Callback (error / result)
            })

        }

    }

    //Get all Results from Tasks
    async.parallel(tasks, (e,result) => {
        //Render Result as JSON
        res.json(result);
    });

    

}

