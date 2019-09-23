const mongoose = require('mongoose');
const {Schema} = mongoose;
const crypto = require('../../helpers/crypto');
const {ROLE_NAMES_ENUM, ROLES_NAMES} = require('../../config/auth/roles');

const userSchema = new Schema({
    first_name: {type: String, trim: true},
    last_name: {type: String, trim: true},
    email: {type: String, lowercase: true, trim: true},
    password: {type: String, trim: true},
    job_title: {type: String, trim: true},
    company: {type: String, trim: true},
    birth_date: {type: Date},
    how_did_you_hear_about_us: {type: String},
    country: {type: String, trim: true},
    city: {type: String, trim: true},
    mobile: {type: String, trim: true},
    provider: {type: String, enum: ['local', 'facebook']},
    facebook_provider: {
        id: {type: String},
    },
    roles: {type: Array, default: ['customer'], required: true},
    token: {type: String, trim: true},
    verify_email: {
        token: {type: String, trim: true},
        token_expiration: {type: Date},
        token_time: {type: Date},
    },
    reset_password: {
        token: {type: String, trim: true},
        token_expiration: {type: Date},
        token_time: {type: Date},
    },
    is_verified: {type: Boolean, default: false},
    is_blocked: {type: Boolean, default: false},
    profile_image: {type: String},
    articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
    bundles: {type: Number, default: 0},
});


userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = crypto.createHash(this.password);
    }
    if (this.isModified('email')
        || this.isModified('roles')) {
        this.token = this.generateToken();
    }
    next();
});


userSchema.methods.generateToken = function () {
    const token = crypto.generateJwtToken({
        sub: this._id,
        email: this.email,
        roles: this.roles,
    });
    return token;
};

userSchema.index({first_name: 1});
module.exports = mongoose.model('User', userSchema);
