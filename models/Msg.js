import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const options = {
    collection: 'msg',
    timestamps: true,
    versionKey: false
};

const MsgSchema = new Schema({
    msgid: {type: String, index: {unique: true}, default: generateMsgID},
    sender: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    reciver: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: Number,
    msg: String,
    ref: String,
    deleted: {type: Boolean, default: false},
}, options);

function generateMsgID(){
    return crypto.randomBytes(8).toString('hex');
}

module.exports = mongoose.model('Msg', MsgSchema);