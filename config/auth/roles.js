const _ = require('lodash');
const ADMIN = 'admin';
const CUSTOMER = 'customer';
const GUEST = 'guest';
const ROLE_NAMES_ENUM = [
    ADMIN,
    CUSTOMER,
    GUEST,
];
const ROLES_NAMES = {
    ADMIN,
    CUSTOMER,
    GUEST,
};

module.exports = {ROLE_NAMES_ENUM, ROLES_NAMES};
