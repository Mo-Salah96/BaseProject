const _ = require('lodash');
const path = require('path');
const BaseController = require('../../BaseController');
const express = require('express');
const RESOURCE_NAMES = require('../../../config/auth/resource_names');
const router = express.Router({mergeParams: true});
const config = require('../../../config');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const LocalService = require('../../../services/core/auth/LocalAuthService');
const {users} = require('../../../helpers/validation');
const {ALLOWED_FILE_TYPES} = require('../../../config/constants/common');
const {pUserLogin} = require('../../../helpers/projections');

const {
    multerMW,
    multipartParser,
} = require('../../middlewares');
const upload = multerMW(
    {
        size: 5 * 1024 * 1024,
        fields: [
            {name: 'profile_image', count: 1, ext: ALLOWED_FILE_TYPES.IMAGES}
        ]
    }
);


passport.use(new LocalStrategy(
    async function (email, password, done) {
        try {
            const user = await LocalService.login(email, password);
            done(null, user);

        } catch (err) {
            done(err);
        }
    }
));


router.post('/login', passport.authenticate('local', {session: false}), async (req, res, next) => {
    try {
        if (req.user.token)
            req.session.token = req.user.token;
        res.send(pUserLogin.pickFrom(req.user));
    } catch (err) {
        next(err);
    }
});

router.post('/register', upload, multipartParser, async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(users.register, data);
        const response = await LocalService.register(data, req.files);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.post('/verify/send', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(users.send_verify, data);
        const response = await LocalService.sendVerificationEmail(data.id);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.post('/verify', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(users.verify, data);
        const response = await LocalService.verifyEmail(data.id, data.token);
        res.send(response);

    } catch (err) {
        next(err);
    }
});

router.post('/reset-password/send', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(users.request_reset_password, data);
        const response = await LocalService.requestResetPassword(data.email);
        res.send(response);

    } catch (err) {
        next(err);
    }
});
router.post('/reset-password', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(users.reset_password, data);
        const response = await LocalService.resetPassword(data.id, data.token, data.password);
        res.send(response);

    } catch (err) {
        next(err);
    }
});

module.exports = new BaseController('/auth', 'public', router);
