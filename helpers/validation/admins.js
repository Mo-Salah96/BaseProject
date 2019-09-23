module.exports = {
    create: {
        type: 'object',
        properties: {
            first_name: {type: 'string', maxLength: 64},
            last_name: {type: 'string', maxLength: 64},
            email: {type: 'string', format: 'email'},
            password: {type: 'string', maxLength: 64},
            mobile: {type: 'string', minLength: 6}
        },
        required: ['first_name', 'last_name', 'email', 'password'],
        additionalProperties: false
    },
};
