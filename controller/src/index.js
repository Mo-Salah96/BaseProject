const _ = require('lodash');
const path = require('path');
const BaseController = require('../BaseController');
const express = require('express');
const router = express.Router({mergeParams: true});
const config = require('../../config');
const utils = require('../../helpers/utils');


router.get('/', async (req, res, next) => {
    return res.send(config.app);
});


if (utils.inDevelopment()) {
    router.get('/docs', async (req, res, next) => {
        try {
            const view = path.join(__dirname, '../../docs/swagger-ui/index.html');
            return res.sendFile(view);
        } catch (err) {
            return next(err);
        }
    });
}
module.exports = new BaseController('/', 'public', router);
