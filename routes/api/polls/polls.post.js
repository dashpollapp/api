import Poll from '../../../models/Poll';

export function createPoll(req, res, next) {

    const {heading, text, polltype, category, media, answers = [], maxVotes } = req.body;
    
    
    let poll = {
        author: req.user._id,
        heading,
        text,
        category,
        polltype: parseInt(polltype),
    };

    

    if(media) {
        switch(media.type) {
            case 'youtube':
            case 'spotify':
                poll.media = media
            break;
            case 'IMAGE':
                poll.media = {type: 'image', uri: 'IMAGE_NOT_FOUND'}
            break;
        }
    }

    switch(parseInt(polltype)){
        case 20:
            let pollAnswers = [];
            let id = 0;
            answers.forEach(answer => {
                pollAnswers.push({
                    id: id++,
                    text: answer
                })
            });
            poll.answers = pollAnswers;
            poll.maxVotes = maxVotes;
        break;
        default:
        break;

    }
    
    poll = new Poll(poll);
    poll.save()
        .then(poll => {
            res.status(201).json({status: 'ok', msg: 'POLL_SUCESSFULLY_CREATED', poll: poll});
        })
        .catch(err => {
            res.status(500).json({error: 'ERR_SERVER_SIDE'});
            console.error(err);
        })

}