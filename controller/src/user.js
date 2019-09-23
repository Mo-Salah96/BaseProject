const _ = require('lodash');
const path = require('path');
const BaseController = require('../BaseController');
const express = require('express');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const router = express.Router({mergeParams: true});
const {users} = require('../../helpers/validation');
const UserService = require('../../services/core/UserService');
const {pUserBasicData} = require('../../helpers/projections');
const {ALLOWED_FILE_TYPES} = require('../../config/constants/common');

const {
    multerMW,
    multipartParser,
} = require('../middlewares');
const upload = multerMW(
    {
        size: 5 * 1024 * 1024,
        fields: [
            {name: 'profile_image', count: 1, ext: ALLOWED_FILE_TYPES.IMAGES}
        ]
    }
);
router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const filters = req.query;
        const params = req.query;
        let response = await UserService.getAll(filters, params);
        if (Array.isArray(response)) {
            response = pUserBasicData.pickFromArray(response)
        } else {
            response.users = pUserBasicData.pickFromArray(response.users);
        }
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', upload, multipartParser, async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['updateOwn'], () => req.user_id.toString() === req.params.id);
        const data = req.body;
        req.validate(users.update, data);
        let response = await UserService.update(req.params.id, data, req.files);
        res.send(pUserBasicData.pickFrom(response));
    } catch (err) {
        next(err);
    }
});

module.exports = new BaseController('/users', 'private', router);
