const _ = require('lodash');
const path = require('path');
const BaseController = require('../../BaseController');
const express = require('express');
const RESOURCE_NAMES = require('../../../config/auth/resource_names');
const router = express.Router({mergeParams: true});
const config = require('../../../config');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const FacebookService = require('../../../services/core/auth/FacebookAuthService');
const {pUserLogin} = require('../../../helpers/projections');
passport.use(new FacebookTokenStrategy(config.facebook,
    async function (accessToken, refreshToken, profile, done) {
        const userData = {
            first_name: profile._json.first_name,
            last_name: profile._json.last_name,
            email: profile._json.email,
            provider: 'facebook',
            facebook_id: profile._json.id,
            accessToken: accessToken,
        };
        const user = await FacebookService.login(userData);
        return done(null, user);

    }));

router.post('/facebook', passport.authenticate('facebook-token', {session: false}), async (req, res, next) => {
    try {
        req.session.token = req.user.token;
        res.send(pUserLogin.pickFrom(req.user));
    } catch (err) {
        next(err);
    }
});
module.exports = new BaseController('/auth', 'public', router);
