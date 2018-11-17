import mongoose from 'mongoose';
import crypto from 'crypto';
import { userRegExp, emailRegExp} from '../config/regex';

let Schema = mongoose.Schema;

const options = {
    id: false,
    collection: 'users',
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
    uuid: {type: String, index: {unique: true}, default: generateUuid},
    username: { type: String,
                required: [true, "ERR_USERNAME_REQUIRED"], 
                index: {unique: true},
                validate: validator.username},
    fullname: { type: String, 
                required: [true, "ERR_FULLNAME_REQUIRED"],
                validate: validator.fullname},
    auth: {
        password: {type: String, required: [true, "ERR_PASSWORD_REQUIRED"]},
        salt: {type: String, default: generateSalt, required: true}
    },
    email: {
        address: {  type: String, 
                    lowercase: true,
                    index: {unique: true}, 
                    //required: [true, "ERR_EMAIL_REQUIRED"],
                    validate: validator.email},
        verified: {type: Boolean, default: false}
    },
    meta: { 
        bio: {type: String, default: 'Hi im using Dashpoll'},
        color: {type: Number, default: 187},
        pb: {type: String, default: 'default'}
    },
    private: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
},options);

UserSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (user.isModified('auth.password')) {
        let salt = generateSalt(),
        hash = crypto.createHash('sha512').update(user.auth.password + salt).digest("hex");

        user.auth = {
            password: hash,
            salt: salt
        }  
    }

    // set email.verified to false if changed
    if (user.isModified('email.address')) user.email.verified = false;

    
    next();
});

function generateUuid(){
    return crypto.randomBytes(8).toString('hex');
}

function generateSalt(){
    return crypto.randomBytes(4).toString('hex');
}

UserSchema.static('findByUsername', function (username) {
    return this.findOne({ username: { $regex : new RegExp('^' + username + '$', "i") } });
});

UserSchema.static('findByEmail', function (email) {
    return this.findOne({ 'email.address': { $regex : new RegExp('^' + email + '$', "i") } });
});

UserSchema.static('findById', function (id) {
    return this.findOne({ _id: id });
});

export default mongoose.model('User', UserSchema);