const fs = require('fs');
const path = require('path');
const express = require('express');
const {authentication, hooks, language} = require('../controller/middlewares');
const utils = require('../helpers/utils');
const session = require('express-session');

const controllerDir = '../controller/src';

class Router {
    constructor(app, config) {
        this.app = app;
        this.config = config;
    }

    initialize() {
        this.app.set('trust proxy', 1); // trust first proxy
        this.app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 60*60000,
                httpOnly: false // <- set httpOnly to false
            },
        }));
        this.app.use(hooks);
        this.app.use(language);
        this.initDocs();
        const privateControllers = [];
        const publicControllers = [];

        const dir = path.join(__dirname, controllerDir);
        this.getControllers(dir, privateControllers, publicControllers);

        this.injectControllers(publicControllers);
        this.app.use(authentication);
        this.injectControllers(privateControllers);
    }

    getControllers(dir, privateControllers, publicControllers) {

        const files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            const controllerDir = path.join(dir, files[i]);
            if (fs.lstatSync(controllerDir).isDirectory()) {
                this.getControllers(controllerDir, privateControllers, publicControllers);
            } else {
                const controller = require(controllerDir);
                if (controller.type === 'private') {
                    privateControllers.push(controller);
                } else {
                    publicControllers.push(controller);
                }
            }
        }
    }

    injectControllers(controllers) {
        for (let i = 0; i < controllers.length; i++) {
            this.app.use(controllers[i].url, controllers[i].router);
        }
    }

    initDocs() {
        if (utils.inDevelopment()) {
            const files = path.join(__dirname, '../docs/swagger-ui');
            const oaSpecs = path.join(__dirname, '../api.yaml');
            this.app.use('/swagger-ui', express.static(files));
            this.app.use('/swagger-ui/api.yaml', express.static(oaSpecs));
        }
    }


}

module.exports = Router;


