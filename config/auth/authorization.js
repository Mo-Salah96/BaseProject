const AccessControl = require('accesscontrol');
const RESOURCE_NAMES = require('./resource_names');
const {ROLES_NAMES} = require('./roles');
//uploadingFiles.personal_files
const grantsObject = {
    [ROLES_NAMES.ADMIN]: {

        [RESOURCE_NAMES.ADMIN]: {
            'create:any': ['*'], 'read:any': ['*']
        },
        [RESOURCE_NAMES.USER]: {
            'update:own': ['*'], 'read:any': ['*']
        },
    },
    [ROLES_NAMES.CUSTOMER]: {

        [RESOURCE_NAMES.USER]: {
            'update:own': ['*']
        },
    },
    [ROLES_NAMES.GUEST]: {},
};
module.exports = new AccessControl(grantsObject);
