import { userRegExp, emailRegExp} from '../../../../config/regex';

export default function(req, res, next){

    const { username, fullname, email, bio, color } = req.body;
    let errors = [];

    if(username && !userRegExp.test(username)) errors.push("ERR_USERNAME_INVALID");
    if(fullname && fullname.length > 32) errors.push("ERR_FULLNAME_INVALID");
    if(email && !emailRegExp.test(email)) errors.push("ERR_USERNAME_INVALID");
    if(bio && bio.length > 128) errors.push("ERR_BIO_INVALID");
    if(color && !/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) errors.push("ERR_COLOR_INVALID");


}
