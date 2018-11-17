import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const options = {
    collection: 'votes',
    timestamps: true,
    versionKey: false
};

const VoteSchema = new Schema({
    pollid: {
        type: Schema.ObjectId,
        ref: 'Poll'
    },
    voter: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    choice: Schema.Types.Mixed,
}, options);

VoteSchema.static('findById', function (id, user) {
    return this.findOne({ pollid: id, voter: user });
});

VoteSchema.static('getTotal', function (id) {
    return this.find({ pollid: id, choice: 1 }).count();
});

VoteSchema.static('findByChoice', function (id, choice) {
    return this.find({ pollid: id, choice: choice });
});

module.exports = mongoose.model('Vote', VoteSchema);