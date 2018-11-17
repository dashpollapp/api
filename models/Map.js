import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const options = {
    collection: 'locations',
    timestamps: true,
    versionKey: false
};

const MapSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    location: {
        lat: Number,
        long: Number,
    },
    hidden: {type: Boolean, default: false},
}, options);

module.exports = mongoose.model('Map', MapSchema);