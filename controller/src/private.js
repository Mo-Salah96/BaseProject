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


module.exports = new BaseController('/private', 'private', router);
