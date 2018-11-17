import Map from '../../../models/Map';
import Follow from '../../../models/Follow';

export default function(req, res, next){

    Follow.findFriends(req.user._id)
    .then(d => {
        Map.find({user: d, hidden: false})
        .populate('user', 'uuid username pb fullname -_id')
        .select('-_id -createdAt')
        .then(d => {
            res.json(d);
        })
    })
  
}