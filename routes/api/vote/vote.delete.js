import Poll from '../../../models/Poll';
import Vote from '../../../models/Vote';

export function checkAvailability(req, res, next) {

    const data = req.body;
    
    //Check if data is exists
    if(!data.pollid || !(typeof data.choice === typeof 1) && data.length !== 2){
        return res.status(400).end('ERR_BAD_REQUEST');
    }

    //Ob Choice im Rahmen des Möglichen ist
    if(data.choice > 10 || data.choice < 0){ return res.status(400).end('ERR_CHOICE_INVALID'); }
awdawdtest
    //Check if Choice is Int
    if(!Number.isInteger(parseInt(data.choice))) return res.status(404).json({error: 'ERR_CHOICE_MUST_BE_AN_INTEGER'});

    //Test    

    //Find Poll from Database
    Poll.findOne({_id: data.pollid})
        .then(poll => {
            //Check if Poll is Exists
            if(!poll) return res.status(404).json({error: 'ERR_POLL_NOT_FOUND'}); 
            //If Poll exists, goto vote
            next(poll);
        })
        .catch(err => {
            //Render Error if exists
            res.status(500).json({error: "ERR_SERVER_SIDE"});
            console.error(err);
        });

}

export function delvote(poll, req, res, next) {

    let { choice } = req.body;
    choice = parseInt(choice);

    let update = {}; // -> Update Objekt

    if(poll.polltype !== 20) {
        if(choice < 0 || choice > 1) return res.status(400).json({error: 'ERR_CHOICE_INVALID'});
        update.choice = choice; // -> Set Choice into Objekt
    }

    if(poll.polltype === 10 && choice !== 1) return res.status(400).json("ERR_CHOICE_INVALID");


    switch(poll.polltype){
        case 20: //Multiple Choice

            const validChoices = poll.answers.map(answer => answer.id);
            if(!validChoices.includes(choice)) return res.status(400).json("ERR_CHOICE_IdddNVALID");

            //Prüfen, ob man dafür bereits abgestimmt hat
            Vote.findOne({pollid: poll._id, voter: req.user._id, choice: choice})
                .then(voteExists => {
                    if(!voteExists) return res.json("VOTED_DOSENT_EXIST");
                    //Update Vote in Database
                    Vote.update({pollid: poll._id, voter: req.user._id},
                        { $pull: {choice: choice}},
                        { upsert: true}) // -> Check if Vote already Exists != create vote
                        .then(d => {
                            res.json(d); 
                        })
                })
                .catch(err => {
                    console.log(err);
                });

            break;
        
        case 10:
        case 11:
        case 12:
            //Update Vote in Database
            Vote.update({pollid: poll._id, voter: req.user._id},
                { $set: { choice: null }},
                { upsert: true})
                .then(d => {
                    res.json(d); 
                })
                .catch(err => {
                    res.end("13");
                    console.log(err);
                });
            break;
        default:
            res.end("35");
            break;                
    }

   

}
