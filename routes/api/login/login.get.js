export default function(req, res, next){

    if(req.isLoggedin){
        return res.status(200).json({status: "logged in"});
    } else {
        return res.status(401).json({status: "not logged in"});
    }
}