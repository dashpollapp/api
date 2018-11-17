import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = {
    collection: 'polls',
    timestamps: true,
    versionKey: false,
};

const PollSchema = new Schema({
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    heading: String,
    polltype: Number,
    category: Number,
    text: String,
    maxVotes: Number,
    media: Schema.Types.Mixed,
    answers: Schema.Types.Mixed,
}, options);

PollSchema.static('findById', function (id) {
    return this.findOne({ _id: id });
});

PollSchema.static('findByAuthor', function (id) {
    return this.find({ author: id });
});

module.exports = mongoose.model('Poll', PollSchema);