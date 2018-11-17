import User from '../../../../models/User';
import { userRegExp, emailRegExp} from '../../../../config/regex';

export function editUser(req, res, next){

    const { username, fullname, email, bio, color } = req.body;

    let changes = {}; // -> Changes Objekt

    if(username && username !== req.user.username) changes.username = username; // -> Add Username to Changes if edit 
    if(fullname && fullname !== req.user.fullname) changes.fullname = fullname; // -> Add Fullname to Changes if edit
    if(email && email !== req.user.email.address) changes.email = email; // -> Add Email to Changes if edit
    if(bio && bio !== req.user.meta.bio) changes.bio = bio; // -> Add Bio to Changes if edit
    if(color && color !== req.user.meta.color) changes.color = color; // -> Add Color to Changes if edit

    if(isEmpty(changes)) return res.json({error: 'NOTHING_WAS_UPDATED'});

    Promise.all([checkUsername(changes), checkEmail(changes)]) // -> Check if Email and Username are available
    .then(() => {
        next(changes); // -> Jump to updateUser with Changes Objekt
    })
    .catch(err => {
        res.json(err); // -> Render error if exists
    });

}

export function updateUser(changes, req, res, next){

    User.findOne({_id: req.user._id}) // -> Get User from Database
    .then(user => {

        (changes.username) ? user.username = changes.username : null; // -> Change old Username with New One 
        (changes.fullname) ? user.fullname = changes.fullname : null; // -> Change old Fullname with New One
        (changes.email) ? user.email.address = changes.email : null; // -> Change old Email with New One
        (changes.bio) ? user.meta.bio = changes.bio : null; // -> Change old Bio with New One
        (changes.color) ? user.meta.color = changes.color : null; // -> Change old Color with New One

        User.update({_id: req.user._id}, // -> Update User in Database
        {$set: user})
        .then(d  => {
            res.json({msg: 'SUCCESSFULLY_UPDATED'});
        })
        
    })

}

// Check Username Funktion (Promise)
const checkUsername = (changes) => new Promise((resolve, reject) => {
    if(changes.username) {
        if(userRegExp.test(changes.username) === false) reject({error: 'ERR_USERNAME_REGEX_NOT_CORRECT'});

        User.findOne({username: changes.username})
        .then(d => {
            if(d) reject({error: 'ERR_USERNAME_ALREADY_EXISTS'});
            resolve();
        })
    } else {
        resolve();
    }
});

// Check Email Funktion (Promise)
const checkEmail = (changes) => new Promise((resolve, reject) => {
    if(changes.email) {
        if(emailRegExp.test(changes.email) === false) reject({error: 'ERR_EMAIL_REGEX_NOT_CORRECT'});

        User.findOne({email: {address: changes.email}})
        .then(d => {
            if(d) reject({error: 'ERR_EMAIL_ALREADY_EXISTS'});
            resolve();
        })
    } else {
        resolve();
    }
});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}