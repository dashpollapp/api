import User from '../../../models/User';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs';
import Busboy from 'busboy';

    try {
        if(!fs.existsSync("uploads")) fs.mkdirSync('uploads');
        if(!fs.existsSync("uploads/pb")) fs.mkdirSync('uploads/pb');
        if(!fs.existsSync("uploads/chat")) fs.mkdirSync("uploads/chat");
        if(!fs.existsSync("uploads/polls")) fs.mkdirSync("uploads/polls");
    } catch (err) { 
        console.log(err); 
    }

export default function uploadImage(req, res, next){

    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) { 

        const id = generateImageID();

        User.findOne({_id: req.user._id})
        .then(result => {
            if(!result) return res.status(404).json({error: 'ERR_USER_NOT_FOUND'});

            const webp = sharp().webp({ quality: 70})
                                .on('info', info => {
                                    console.log(info);

                                })
                                .on('error', err => {
                                    console.log(err)
                                  })
            const outputStream = fs.createWriteStream('uploads/pb/' + id);

            file.pipe(webp).pipe(outputStream);

            result.meta.pb = id;

            User.update({_id: req.user._id},
            {$set: result}).
            then(d => {
                res.json('SUCCESSFULLY_UPDATED');
            })
        })      
    });
    
    req.pipe(busboy);
}

function generateImageID(){
    return crypto.randomBytes(8).toString('hex');
}

function cancelUpload(stream, id){
    stream.destroy();
    setTimeout(() =>{
        fs.unlinkSync("uploads/pb/" + id);
    }, 1000)

}