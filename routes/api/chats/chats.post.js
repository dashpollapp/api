import Msg from '../../../models/Msg'
import User from '../../../models/User'

export function sendMsgs(req, res, next){

    const msgs = req.body;

    msgs.forEach(d => {
        User.findByUuid(d.reciver)
        .then(reciver => {
            const msg = {
                sender: socket.user._id,
                reciver: reciver._id,
                msg: msg.msg,
                type: msg.type || 0
            }
        })
    });
} 

import sharp from 'sharp';
import formidable from 'formidable';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

export function uploadeImage(req, res, next) {
    
    sharp.cache(false);
    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.uploadDir = path.join(__dirname, '../../../uploads/tmp/');
    form.parse(req);

    form.on('file', (field, file) => {

        const id = generateImageID();

        let filepath = __dirname + '/../../../uploads/chat/' + id + '.' + file.type.split('/')[1];

        sharp(file.path)
        .toFile(filepath, (err, info) => {
            if(err) {
                //deleteFile([filepath, file.path]);
                console.log(err);
            }
        });

        deleteFile([file.path]);

        console.log(field)
    });
}

function generateImageID(){
    return crypto.randomBytes(8).toString('hex');
}

function deleteFile(paths) {
    setTimeout(() => {
        paths.forEach((path) => {
            try {
                fs.unlinkSync(path);
            } catch (e) {
                console.log(e);
            }
        });

    }, 300);
}