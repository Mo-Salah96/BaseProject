const BaseService = require('../../BaseService');
const {ROLES_NAMES} = require('../../../config/auth/roles');
const {User} = require('../../../db/models');

class AdminService extends BaseService {

    async create(data) {
        data.roles = [ROLES_NAMES.ADMIN];
        data.is_verified = true;
        const existingUser = await User.getOne({$or: [{email: data.email}, {$and: [{mobile: data.mobile}, {mobile: {$exists: true}}]}]});
        if (existingUser) {
            throw new this.ValidationError(0, `there is users with this email or phone `);
        }
        const user = await User.create(data);
        return {_id: user._id, is_verified: user.is_verified};
    }

    async getAll(filters, params = {}, pagination = false) {
        const nParams = params;
        const query = {};
        if (filters.name) {
            query['$or'] = [
                {
                    first_name: {$regex: filters.name}
                },
                {
                    last_name: {$regex: filters.name}
                },
            ];
        }
        query['roles'] = {$in: [ROLES_NAMES.ADMIN]};
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        return await User.getAll(query, nParams, paginate);

    }

}

module.exports = new AdminService();
