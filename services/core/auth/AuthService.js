const BaseService = require('../../BaseService');

class AuthService extends BaseService {
    register() {
        throw new this.ValidationError(0, `need to be implemented`)
    }

    login() {
        throw new this.ValidationError(0, `need to be implemented`)
    }


}

module.exports = AuthService;
