import mongoose from 'mongoose';
import { userRegExp, emailRegExp} from '../config/regex';

let Schema = mongoose.Schema;

const options = {
    id: false,
    collection: 'guests',
    timestamps: true,
    toObject: { getters: true },
    versionKey: false
};

const validator = {
    username: {
        validator: function(v) {
          return userRegExp.test(v);
        },
        message: 'ERR_USERNAME_INVALID'
      },
    fullname: {
        validator: function(v) {
          return v.length > 2;
        },
        message: 'ERR_FULLNAME_INVALID'
      },
    email: {
        validator: function(v) {
          return emailRegExp.test(v);
        },
        message: 'ERR_EMAIL_INVALID'
      },
}

let UserSchema = new Schema({
    cookie: String,
    userAgent: String,
    ref: String,
    ip: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
},options);


UserSchema.static('findByCookie', function (cookie) {
    return this.findOne({ cookie });
});

UserSchema.static('findById', function (_id) {
    return this.findOne({ _id });
});

UserSchema.static('findByIp', function (ip) {
    return this.find({ ip, createdAt: { $gt: new Date(new Date().getTime() - (1000*60*60*2))}});
});



export default mongoose.model('Guest', UserSchema);