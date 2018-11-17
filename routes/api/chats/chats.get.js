import Msg from '../../../models/Msg';

export function getMsgs(req, res, next){

    Msg.find({reciver: req.user._id})
    .populate("sender reciver", "username fullname -_id")
    
    .then(d => {

        let msgs = [];

        d.forEach(d => {
            const msg = {
                msgid: d.msgid,
                sender: d.sender.username,
                reciver: d.reciver.username,
                type: d.type,
                msg: (!d.deleted) ? d.msg : 'This message has been deleted!',
                ref: d.ref,
                deleted: d.deleted,
                date: d.createdAt
            }
            msgs.push(msg);
        })
        
        res.json(msgs);

    })
      
} 