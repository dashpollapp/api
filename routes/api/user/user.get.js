import User from '../../../models/User';
import Relation from '../../../models/Relation';
import Poll from '../../../models/Poll';

export function checkUser(req, res, next){

    let username = req.params.username;

    if(!username){
        if(!req.isLoggedin) return res.status(401).json({error:"not logged in", msg: "you need to specify an username if you're not logged in"});
        username = req.user.username;
    }

    User.findByUsername(username)
    .then(user => {

        if(!user) return res.status(404).json({error: 'ERR_USER_NOT_FOUND'})

        if(req.isLoggedin) {

            Relation.findBlock(user._id, req.user._id)
            .then(block => {
    
                if(block.self) return res.status(404).json({error: 'ERR_USER_NOT_FOUND'})
                if(block.target) return res.status(404).json({error: 'ERR_USER_NOT_FOUND'})

                next(user);
    
            })
        
        } else {next(user)}

    })
    
}

export function getUser(user, req, res, next){

    Promise.all([getUserInfo(user), getFollowerCount(user._id), getFollowedCount(user._id), getPollsCount(user._id)])
    .then(result => {
        
        let users = {
            username: result[0].username,
            fullname: result[0].fullname,
            number: '01749387403',
            meta: result[0].meta,
            joined: new Date(result[0].createdAt).getTime() / 1000 | 0,
            num: {
                follower: result[1],
                following: result[2],
                polls: result[3]
            }

        }
        res.json(users);
    })

}

const getUserInfo = (username) => new Promise((resolve, reject) => {
    resolve(username);
});

const getFollowerCount = (id) => new Promise((resolve, reject) => {
    Follow.find({target: id, following: true}).count()
    .then(num => resolve(num));
});

const getFollowedCount = (id) => new Promise((resolve, reject) => { // Wem du Folgst
    Follow.find({follower: id, following: true}).count()
    .then(num => resolve(num));
});

const getPollsCount = (id) => new Promise((resolve, reject) => { // Wem du Folgst
    Poll.find({author: id}).count()
    .then(num => resolve(num));
});