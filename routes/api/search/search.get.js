import User from '../../../models/User';

export default function(req, res, next){

    const {query, limit = 4, skip = 0} = req.query;
    
    //Check if Query is exists
    if(!query) return res.status(404).json({status: 'error', msg: 'query not found'});

    //Get User from Database
    User.find({username: {'$regex': new RegExp("^" + query, "i")}}) // -> Database Query
        .sort({username: 1}) // -> Sort by ABC
        .limit(parseInt(limit)) // -> Limit (Results)
        .skip(parseInt(skip)) // -> Skip (Results) 
        .select('-_id username fullname pb') // -> Get Username / Fullname and PB
        .then(users => {
            //Check if Result > 0
            if(users.length === 0) return res.status(404).json({msg: 'not found'}); 
            //Render User as JSON <- dümste
            res.json(users);
        })
        .catch(err => {
            //Render Error if exists
            console.error(err);
            return res.end('error');
        })




}