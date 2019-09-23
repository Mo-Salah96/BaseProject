const BaseService = require('../BaseService');
const {ROLES_NAMES} = require('../../config/auth/roles');
const {User} = require('../../db/models');

class UserService extends BaseService {

    async update(id, data, files) {
        // todo upload files
        return await User.updateById(id, data, {new: true});
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
        query['roles'] = {$in: [ROLES_NAMES.CUSTOMER]};
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        return await User.getAll(query, nParams, paginate);
    }
}

module.exports = new UserService();
