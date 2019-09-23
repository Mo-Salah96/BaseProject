const AuthService = require('./AuthService');
const {User} = require('../../../db/models');

class FacebookAuthService extends AuthService {
    async login(userData) {
        const user = await User.getOne({'facebook_provider.id': userData.facebook_id});
        return !user ? this.register(userData) : user;
    }

    async register(userData) {
        const data = {
            ...userData,
            is_verified: !!userData.email,
            facebook_provider: {
                id: userData.facebook_id,
                token: userData.accessToken
            },
        };

        const user = await User.create(data);
        //TODO send welcome email
        return user;
    }
}


module.exports = new FacebookAuthService();
