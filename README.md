## Base Node.Js project
> A simple & some layers to start new Project.

This Base will simplify the creation of project, you will just need to implement the controllers
and it's service. this base will make every request passes to four layers.

**Application Layers**

1. ****Authentication****   
    using [JWT](https://jwt.io) and [Express-Session](https://github.com/expressjs/session) 
    saving the session **Cookies** or **Radis** depend on what store you want to store in
    ```js
        var session = require('express-session')
        this.app.set('trust proxy', 1); // trust first proxy
        this.app.use(session({
            secret: 'Secret Key',
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 60*60000,
                httpOnly: false // <- set httpOnly to false
            },
        }));
    ```
2. Authorization
    we grant every resource to the specified role
    using [Access control](https://www.npmjs.com/package/accesscontrol) to impalement authentication using one file and one line in each controller 
    ```js
       const AccessControl = require('accesscontrol');
       const RESOURCE_NAMES = require('./resource_names');
       const {ROLES_NAMES} = require('./roles');
       const grantsObject = {
           [ROLES_NAMES.ADMIN]: {
       
               [RESOURCE_NAMES.ADMIN]: {
                   'create:any': ['*'], 'read:any': ['*']
               },
               [RESOURCE_NAMES.USER]: {
                   'update:own': ['*'], 'read:any': ['*']
               },
           },
           [ROLES_NAMES.CUSTOMER]: {
       
               [RESOURCE_NAMES.USER]: {
                   'update:own': ['*']
               },
           },
           [ROLES_NAMES.GUEST]: {},
       };
       module.exports = new AccessControl(grantsObject);
       
    ```
3. Validation
    using [AJV](https://www.npmjs.com/package/ajv) to validate each request body before it start the Service
    ```js
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
    ```
4. Service
    this for you Own business how the system will work
<br>

> * You need to be familiar with express framework.
> * you need to be aware of middlewares.


#### Package Components
* configuration: configuration for the code 
* controller: that contains all the controllers in the application  
* db: Mongose Database configured to have some plugins 
* docs: Swagger documentation
* helpers: that handle errors notifications projection and storage and validation
* routes : that route all controllers to it's function
* service: Here is where your business  
#### Installation
```
npm install 
```

#### 1- configuration
You will need to create a new instance from GrpcServer with appropriate configurations then start your server.

as default you will have **config.dev** and **config.prod** this two configurations 
will be responsible for the configuration of the app 
> You can make another configuration file that end with it's name and insert it in index.js 

Example:
```js
module.exports = {
    app: {
        version: '0.0.0',
        name: 'Base-Dev',
    },
    port: 3000,
    db: {
        url: `mongodb://localhost:27017/task`
    },
    facebook: {
        clientID: 'dummy',
        clientSecret: 'dummy',
    },
    storage: {
        accessKey: '',
        secretKey: '',
        baseUrl: '',
        bucket: '',
        region: '',
        folder: '',
    },
    auth: {
        local: {
            key: ''
        }
    },
    NODE_ENV: 'development',
};

```

having the auth folder that contain authorization layer and resource names of the application and the roles
 
### 2- Controllers
you will have all your controllers and middleware's You just need to create any file that end with js and export this line 
```js
    const BaseController = require('../BaseController');
    const express = require('express');
    const router = express.Router({mergeParams: true});
    
    router.get('/', async (req, res, next) => {
        return res.send('Hello World');
    });
    
    module.exports = new BaseController('/', 'public', router);

```
in the constructor of BaseController
first is the path of controller 
and private || public for make this controller pass on first layer or not (Authentication)

### 3- Database
you can Configure whatever any database you want 
this one configured to be used with mongodb (Mongoose)

### 4- Docs

Using swagger to show the out put of the documentation in your api /docs

```yaml
  /:
    get:
      tags:
        - Public
      summary: Get App version
      responses:
        200:
          $ref: '#/components/responses/version'
```

### 5-Helpers

contains the
    * Error handling  
    * notifications
    * projections
    * storage
    * validation
    * crypto
    
### 6- Services
implementing Your own business will be in Service    
