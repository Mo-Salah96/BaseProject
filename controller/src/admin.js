const _ = require('lodash');
const path = require('path');
const BaseController = require('../BaseController');
const express = require('express');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const router = express.Router({mergeParams: true});
const {admins} = require('../../helpers/validation');
const AdminService = require('../../services/core/admin/AdminService');
const {pUserBasicData} = require('../../helpers/projections');


router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ADMIN, ['readAny']);
        const filters = req.query;
        const params = req.query;
        let response = await AdminService.getAll(filters, params);
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

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        await req.authorize(req.user, RESOURCE_NAMES.ADMIN, ['createAny']);
        await req.validate(admins.create, req.body);
        const response = await AdminService.create(data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
module.exports = new BaseController('/admins', 'private', router);
