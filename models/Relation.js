import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = {
    collection: 'relation',
    timestamps: true,
    versionKey: false
};

const RelationSchema = new Schema({
    source: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    target: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    following: Boolean,
    blocked: Boolean,
}, options);

RelationSchema.static('getFollowerOfUser', function (id) {
    return this.find({ target: id, following: true });
});


RelationSchema.static('findBlock', function (target, self) {
    return new Promise((resolve, reject) => {

        Promise.all([checkBlockedSelf(target, self, this), checkBlockedTarget(target, self, this)]) // -> Check if Email and Username are available
        .then(d => {

            let blocked = {
                target: d[1].target,
                self: d[0].self
            }

            resolve(blocked);
        
        })
        .catch(err => {
            reject(err);
        });

    })

});

const checkBlockedSelf = (target, self, thiss) => new Promise((resolve, reject) => {
    thiss.findOne({source: self, target: target, blocked: true}).count()
    .then(num => {
        resolve({self: num})
    })
});

const checkBlockedTarget = (target, self, thiss) => new Promise((resolve, reject) => {
    thiss.findOne({source: target, target: self, blocked: true}).count()
    .then(num => {
        resolve({target: num})
    })
});

module.exports = mongoose.model('Relation', RelationSchema);