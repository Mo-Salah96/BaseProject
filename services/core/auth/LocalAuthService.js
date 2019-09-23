const AuthService = require('./AuthService');
const {User} = require('../../../db/models');
const crypto = require('../../../helpers/crypto');


class LocalAuthService extends AuthService {
    async login(email, password) {
        const user = await User.getOne({email});
        if (!user) {
            throw new this.NotFoundError(0, `email or password are Wrong `);
        }
        if (!crypto.compareHash(password, user.password)) {
            throw new this.NotFoundError(0, `email or password are Wrong `);
        }
        if (user.is_verified) {
            return user;
        }
        return {_id: user._id, is_verified: user.is_verified};
    }

    async register(userData, files) {
        const existingUser = await User.getOne({$or: [{email: userData.email}, {$and: [{mobile: userData.mobile}, {mobile: {$exists: true}}]}]});

        // TODO upload image
        if (existingUser) {
            throw new this.ValidationError(0, `there is users with this email or phone `);
        }
        const data = {
            ...userData,
            is_verified: false,
            provider: 'local',
        };
        const user = await User.create(data);
        this.sendVerificationEmail(user._id.toString());
        return {_id: user._id, is_verified: user.is_verified};
    }

    async sendVerificationEmail(userId) {
        const emailDelay = 60 * 1000;
        const expirationemail = 15 * 60 * 1000;

        const user = await User.getById(userId);
        if (user.is_verified) {
            throw new this.ValidationError(0, `this account is already verified`);
        }

        const elapsedTime = Date.now() - (user.verify_email.token_time || 0);
        if (elapsedTime < emailDelay) {
            const waitTime = Math.round((emailDelay - elapsedTime) / 1000);
            throw new this.UnauthorizedError(0, `Frequent requests are not allowed, you need to wait ${waitTime} seconds`);
        }
        const emailToken = crypto.generateRandomString(35);
        const tokenTime = Date.now();
        const tokenExpiration = Date.now() + expirationemail;

        user.verify_email.token = emailToken;
        user.verify_email.token_time = tokenTime;
        user.verify_email.token_expiration = tokenExpiration;

        await user.save();
        return {message: 'Email has been sent to your account '};
        // TODO send email to the user verification email
    }

    async verifyEmail(userId, email_token) {
        const user = await User.getById(userId);
        if (!user) {
            throw new this.ValidationError(0, `there is no user with id ${userId}`);
        }
        if (Date.now() > user.verify_email.token_expiration) {
            throw new this.ValidationError(0, `Email has expired`);
        }
        if (email_token.toString() !== user.verify_email.token) {
            throw new this.ValidationError(0, `token is not correct`);
        }
        user.verify_email.token = '';
        user.verify_email.token_time = '';
        user.verify_email.token_expiration = '';
        user.is_verified = true;
        await user.save();
        return {message: 'account Verified Successfully'}
    }

    async requestResetPassword(email) {
        const emailDelay = 60 * 1000;
        const expirationemail = 15 * 60 * 1000;

        const user = await User.getOne({email});
        const elapsedTime = Date.now() - (user.reset_password.token_time || 0);
        if (elapsedTime < emailDelay) {
            const waitTime = Math.round((emailDelay - elapsedTime) / 1000);
            throw new this.UnauthorizedError(0, `Frequent requests are not allowed, you need to wait ${waitTime} seconds`);
        }
        const emailToken = crypto.generateRandomString(35);
        const tokenTime = Date.now();
        const tokenExpiration = Date.now() + expirationemail;

        user.reset_password.token = emailToken;
        user.reset_password.token_time = tokenTime;
        user.reset_password.token_expiration = tokenExpiration;

        await user.save();
        return {message: 'Email has been'};

        // TODO send email to Reset password
    }

    async resetPassword(userId, password_token, password) {
        const user = await User.getById(userId);
        if (!user) {
            throw new this.ValidationError(0, `there is no user with id ${userId}`);
        }
        if (Date.now() > user.reset_password.token_expiration) {
            throw new this.ValidationError(0, `Email has expired`);
        }
        if (password_token.toString() !== user.reset_password.token) {
            throw new this.ValidationError(0, `token is not correct`);
        }
        user.password = password;
        await user.save();
        return {message: 'password Changed successfully'}
    }
}

module.exports = new LocalAuthService();
