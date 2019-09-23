const {countries} = require('../../config/constants');
module.exports = {
    register: {
        type: 'object',
        properties: {
            first_name: {type: 'string', maxLength: 64},
            last_name: {type: 'string', maxLength: 64},
            email: {type: 'string', format: 'email'},
            password: {type: 'string', maxLength: 64},
            job_title: {type: 'string', maxLength: 64},
            company: {type: 'string', maxLength: 64},
            birth_date: {type: 'string', format: 'date'},
            how_did_you_hear_about_us: {type: 'string'},
            country: {type: 'string', enum: countries},
            city: {type: 'string'},
            mobile: {type: 'string', minLength: 6}
        },
        required: ['first_name', 'last_name', 'email', 'password'],
        additionalProperties: false
    },
    update: {
        type: 'object',
        properties: {
            first_name: {type: 'string', maxLength: 64},
            last_name: {type: 'string', maxLength: 64},
            job_title: {type: 'string', maxLength: 64},
            password: {type: 'string', maxLength: 64},
            country: {type: 'string', enum: countries},
            city: {type: 'string'},
        },
        required: [],
        additionalProperties: false
    },
    send_verify: {
        type: 'object',
        properties: {
            id: {type: 'string', maxLength: 64},
        },
        required: ['id'],
        additionalProperties: false
    },
    verify: {
        type: 'object',
        properties: {
            id: {type: 'string', maxLength: 64},
            token: {type: 'string', maxLength: 64},
        },
        required: ['id', 'token'],
        additionalProperties: false
    },
    request_reset_password: {
        type: 'object',
        properties: {
            email: {type: 'string', format: 'email'},
        },
        required: ['email'],
        additionalProperties: false
    },
    reset_password: {
        type: 'object',
        properties: {
            id: {type: 'string', maxLength: 64},
            token: {type: 'string', maxLength: 64},
            password: {type: 'string', maxLength: 64},
        },
        required: ['id', 'token', 'password'],
        additionalProperties: false
    },

};
