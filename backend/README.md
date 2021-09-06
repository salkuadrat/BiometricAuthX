# Biometric Auth Backend

This is a complete guide to create this backend from scratch.

## Installation 

[Download and Install Node.js](https://nodejs.org/en/download/)\
[Download and Install PostgreSQL](https://www.postgresql.org/download/)\
[Download and Install Database Tool DBeaver (Optional)](https://dbeaver.io/)

Check if node.js has been installed by running this command.

```bash
$ node -v 
$ npm -v
```

You can check if your PostgreSQL has been installed by running pgAdmin and login using username and password that you setup during installation.

You can also check it [using DBeaver](https://github.com/dbeaver/dbeaver/wiki).

## Preparation

Create .env file in root directory.

```
PORT = 3000
```

Create .gitignore file in root directory.

```
node_modules/
.env
```

Initialize package.json by running this comand.

```bash
$ npm init --yes
```

Install dependencies.

```bash
$ npm i --save bcryptjs cors dotenv express express-rate-limit helmet http-status-codes jsonwebtoken morgan pg pg-hstore sequelize xss-clean
```

Install development dependencies.

```bash
$ npm i --save-dev nodemon sequelize-cli
```
Here is the details of every dependencies we installed.

[express](https://www.npmjs.com/package/express): Node.js web framework to create our REST APIs.
[dotenv](https://www.npmjs.com/package/dotenv): module to read environment variables from .env into process.env.
[bcryptjs](https://www.npmjs.com/package/bcryptjs): module to hash passwords.
[cors](https://www.npmjs.com/package/cors): module to enable CORS.
[express-rate-limit](https://www.npmjs.com/package/express-rate-limit): module to limit the number of requests per IP address.
[helmet](https://www.npmjs.com/package/helmet): module to secure APIs.
[http-status-codes](https://www.npmjs.com/package/http-status-codes): module to define HTTP status codes.
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): module to generate JWT tokens.
[morgan](https://www.npmjs.com/package/morgan): module to log requests.
[pg](https://www.npmjs.com/package/pg): module to connect with PostgreSQL.
[pg-hstore](https://www.npmjs.com/package/pg-hstore): module to parse PostgreSQL HSTORE type.
[sequelize](https://www.npmjs.com/package/sequelize): module to organize data models from PostgreSQL.
[xss-clean](https://www.npmjs.com/package/xss-clean): module to prevent XSS attacks.

[nodemon](https://www.npmjs.com/package/nodemon): module that will automatically restart the server as we change our codes.
[sequelize-cli](https://www.npmjs.com/package/sequelize-cli): module to generate database models from command line.

## Boilerplate

Edit file `package.json` to describe our project and prepare npm `"scripts"` to run the server.

```json
{
  "name": "bioauth_backend",
  "description": "Biometric Authentication Backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon -r dotenv/config index.js"
  },
  "keywords": [],
  "author": "Salman S",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-rate-limit": "^5.3.0",
    "helmet": "^4.6.0",
    "http-status-codes": "^2.1.4",
    "jsonwebtoken": "^8.5.1",
    "morgan": "^1.10.0",
    "pg": "^8.7.1",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.6.5",
    "xss-clean": "^0.1.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.12",
    "sequelize-cli": "^6.2.0"
  }
}
```

Create file `app.js` in project root directory.

```js
// import dependencies packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// express 
const express = require('express');
const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// security packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 150 }));

app.get('/', (req, res) => {
  res.send('Welcome to Biometric Authentication Server');
});

module.exports = app;
```

And `index.js` in project root directory.

```js
require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

Check if our server works by running this command in the terminal.

```bash
$ npm run dev
```

Visit URL `http://localhost:3000` in your browser. It will show a page with simple message.

```
Welcome to Biometric Authentication Server
```

It will also write log message in the terminal.

```
Server is running on port 3000
```

## Preparing Database 

We will prepare our database by using `sequelize-cli`. First, create file `.sequelizerc` in project root directory.

```js
const path = require('path');

module.exports = {
  'config': path.resolve('./app/config', 'database.js'),
  'models-path': path.resolve('./app/models'),
  'seeders-path': path.resolve('./app/seeders'),
  'migrations-path': path.resolve('./app/migrations')
};
```

Then run this command to generate boilerplate Sequelize files.

```bash
$ sequelize-cli init
```

It will create directory `models`, `migrations` and `seeders` in `app` directory, and create file `app/config/database.js` for database configuration.

Edit file `.env` to add database configurations. Use `DB_USERNAME` and `DB_PASSWORD` that you setup during PostgreSQL installation. 

Use `DATABASE_URL` when you want to connect with remote PostgreSQL database for `NODE_ENV` test or production.

```
HOST = 3000
NODE_ENV = 'development'
DB_HOST = '127.0.0.1'
DB_USERNAME = ''
DB_PASSWORD = ''
DB_NAME = 'bioauth'
DB_DIALECT = 'postgres'
DATABASE_URL = ''
```

And edit `app/config/database.js` to transfer database configurations from `.env` file.

```js
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT
  },
  "test": {
    "use_env_variable": "DATABASE_URL"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
};
```

Don't touch anything at the generated `app/models/index.js` file. It is the entry point for all models that we will create later in `app/models`.

Now, we can create our Postgres database by running this `sequelize-cli` command.

```bash
$ sequelize-cli db:create
```

If it all goes well, it will show a message like this.

```
Sequelize CLI [Node: 16.4.2, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "app\config\database.js".
Using environment "development".
Database bioauth created.
```

## Preparing Models 

Now we will prepare our tables using `sequelize-cli`. For this project, we will create table `Users` and `Posts` by running this command.

```bash
$ sequelize-cli model:generate --name User --attributes username:string,password:string,email:string,biometric:string
$ sequelize-cli model:generate --name Post --attributes title:string,content:string,userId:integer
```

It will generate two model files in `app/models` and two migration files in `app/migrations`.

```
app/models/user.js 
app/models/post.js
app/migrations/...-create-user.js
app/migrations/...-create-post.js
```

Now we need to edit the files to define relationships between table `Users` and `Posts`.

Add references to `userId` in `app/migrations/...-create-post.js`.

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {...},
      title: {...},
      content: {...},
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      createdAt: {...},
      updatedAt: {...}
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};
```

Then edit associate function in `app/models/user.js`.

```js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
  };
  ...
};
```

And associate function in `app/models/post.js`.

```js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE'
      });
    }
  };
  ...
};
```

The last step of this part is applying this changes to the database by running command.

```bash
$ sequelize-cli db:migrate
```

If it all goes well, it will show a message like this.

```
Sequelize CLI [Node: 16.4.2, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "app\config\database.js".
Using environment "development".
== 20210905105142-create-user: migrating =======
== 20210905105142-create-user: migrated (0.025s)

== 20210905105346-create-post: migrating =======
== 20210905105346-create-post: migrated (0.016s)

== 20210905214246-add-refreshToken: migrating =======
== 20210905214246-add-refreshToken: migrated (0.008s)
```

Now you can try to access the `bioauth` database using DBeaver and see two new tables have been created there.

## Initial Dummy Data (Optional)

This step is optional if you want to add initial dummy data to your database. If you don't, feel free to skip this step and add some data later using Postman.

We will create a user admin and two dummy posts.

First, we need to use `sequelize-cli` to generate seeder files.

```bash
$ sequelize-cli seed:generate --name users
$ sequelize-cli seed:generate --name posts
```

It will create two new files in `app/seeders` directory.

```
app/seeders/...-users.js
app/seeders/...-posts.js
```

Edit `app/seeders/...-users.js` to create user `admin` with password `1234`.

```js
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, _) => {
    return await queryInterface.bulkInsert('Users', [{ 
      username: 'admin', 
      email: 'admin@bioauth.com', 
      password: bcrypt.hashSync('1234'),
      biometric: '',
      createdAt: new Date(), 
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, _) => {
    return await queryInterface.bulkDelete('Users', null, {});
  }
};
```

Edit `app/seeders/...-posts.js` to insert two dummy posts data for `admin`.

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Posts', [
      {
        userId: 1,
        title: 'Universe',
        content: 'The easy and flexible way to use interactive maps in Flutter',
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Learning',
        content: 'The easy way to use Machine Learning Kit in Flutter',
        createdAt: new Date(), 
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Posts', null, {});
  }
};
```

And run this command to generate dummy data into the database.

```bash
$ sequelize-cli db:seed:all
```

If it all goes well, it will show a message like this.

```
Sequelize CLI [Node: 16.4.2, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "app\config\database.js".
Using environment "development".
== 20210905112411-users: migrating =======
== 20210905112411-users: migrated (0.232s)

== 20210905112420-posts: migrating =======
== 20210905112420-posts: migrated (0.006s)
```

## Post API 

Before jumping into biometric authentication, we need to prepare REST API for `posts`. It will be updated later with authentication and authorization.

<table>
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/posts</td>
    <td>Find all posts</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/posts/:id</td>
    <td>Find post by id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/posts</td>
    <td>Create a new post</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/posts/:id</td>
    <td>Update a post</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/posts/:id</td>
    <td>Delete a post</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/posts</td>
    <td>Delete all posts</td>
  </tr>
</table>

Create folder and files as follows.

```
app/controllers/
app/middleware/
app/routes/

app/controllers/postController.js
app/controllers/index.js
app/routes/index.js
```

And start preparing boilerplate code for `app/controllers/postController.js`

```js
exports.searchPost = async (req, res) => {

};

exports.findPost = async (req, res) => {

};

exports.createPost = async (req, res) => {

};

exports.updatePost = async (req, res) => {

};

exports.deletePost = async (req, res) => {

};

exports.deleteAllPost = async (req, res) => {

};
```

And prepare `app/controllers/index.js`

```js
const postController = require('./postController');

module.exports = { postController };
```

And add routes `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { postController } = require('../controllers');

const {
  searchPost,
  findPost,
  createPost,
  updatePost,
  deletePost,
  deleteAllPost
} = postController;

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/posts', searchPost);
router.get('/posts/:id', findPost);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.delete('/posts', deleteAllPost);

module.exports = router;
```

Now we can start handling all functionality inside `postController.js`

Let's start with `searchPost`

```js
const { StatusCodes } = require('http-status-codes');
const { Sequelize, Post } = require('../models');

const {
  BAD_REQUEST,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} = StatusCodes;

const iLike = Sequelize.Op.iLike;

exports.searchPost = async (req, res) => {
  let condition = {};

  // if url contains query parameters q, 
  // such as http://localhost:3000/posts?q=title
  // then returns all posts whose title contains q
  if (req.query.q) {
    condition = {
      where: { 
        title: { 
          [iLike]: `%${req.query.q}%` 
        }
      }
    };
  }

  try {
    const posts = await Post.findAll(condition);

    if (posts) {
      return res.json(posts);
    } else {
      return res.status(NO_CONTENT).json({
        message: 'Data not found'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

Next we can fill the `findPost`

```js
exports.findPost = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(BAD_REQUEST).json({
      message: 'No Post ID'
    });
  }

  try {
    const post = await Post.findByPk(id);

    if (post) {
      return res.json(post);
    } else {
      return res.status(NO_CONTENT).json({
        message: 'Data not found'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And then `createPost`

```js
exports.createPost = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.userId;

  if (!title || !content) {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete Parameters'
    });
  }

  try {
    const post = await Post.create({ userId, title, content });

    if (post) {
      return res.json(post);
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Create post failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And `updatePost`

```js
exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  
  if (!id || !title || !content) {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete Parameters'
    });
  }

  try {
    const data = await Post.update(req.body, { where: { id } });
    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (updated) {
      return res.json({
        message: `Post ${id} is updated`
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: `Update post ${id} failed`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And next `deletePost`

```js
exports.deletePost = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(BAD_REQUEST).json({
      message: 'No Post ID'
    });
  }

  try {
    const data = await Post.destroy({ where: { id } });
    // data[0] contains affected rows
    const deleted = data[0] > 0;

    if (deleted) {
      return res.json({
        message: `Post ${id} is deleted`
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: `Delete post ${id} failed`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And last `deleteAllPost`

```js
exports.deleteAllPost = async (req, res) => {
  try {
    const data = await Post.destroy({ truncate: true });
    // data[0] contains affected rows
    const deleted = data[0] > 0;

    if (deleted) {
      return res.json({
        message: 'All posts are deleted'
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Delete posts failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

The last thing to do in this part is edit file `app.js` to apply `routes` from `app/routes/index.js`

```js
// import dependencies packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// express 
const express = require('express');
const app = express();

// define routes
const routes = require('./app/routes');

app.use(express.static('./public'));
app.use(express.json());
app.use(morgan('tiny'));

// security packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// apply routes
app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome to Biometric Authentication Server');
});

module.exports = app;
```

We can test our newly created APIs using Postman or only test the GET endpoints in browser using the following URLs.

Don't forget to run server first.

```
$ npm run dev
```

```
http://localhost:3000/posts
http://localhost:3000/posts/1
http://localhost:3000/posts?q=universe
http://localhost:3000/posts?q=learn
```

You can see the server returns json response according to your request.

For other non-GET endpoints, you can test them using Postman. But POST endpoint won't work for now, since we need authentication to get userId of the post author.

## Profile API 

Another step we need to do before touching authentication is preparing Profile API. This is an optional step to test User model before using it in a more complex authentication API.

Profile API will have one endpoint (for now; we will add one more later).

<table>
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/profile/:username</td>
    <td>Find user profile by username</td>
  </tr>
</table>

For this API we need to create file `app/controllers/userController.js`

```js
const { Post, User } = require('../models');

const { StatusCodes } = require('http-status-codes');
const { NO_CONTENT, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.profile = async (req, res) => {
  const username = req.params.username || req.username;
  
  try {
    const user = await User.findOne({ 
      where: { 
        username: username
      },
      // don't include password & biometric
      attributes: [
        'id',
        'username',
        'email'
      ],
      include: [{
        model: Post,
        as: 'posts'
      }]
    });

    if (user) {
      return res.json(user);
    } else {
      return res.status(NO_CONTENT).json({
        message: 'Data not found'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```
And then update `app/controllers/index.js`

```js
const postController = require('./postController');
const userController = require('./userController');

module.exports = { 
  postController, 
  userController 
};
```

And apply the controller to `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { postController, userController } = require('../controllers');
const { profile } = userController;

...

router.get('/profile/:username', profile);

module.exports = router;
```

We can test the API by hitting the following URL in browser.

```
http://localhost:3000/profile/admin
```

It will return admin profile (without password & biometric) with all its posts.

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@bioauth.com",
  "posts": [
    {
      "id": 1,
      "title": "Title Post ABC",
      "content": "Content Post ABC",
      "userId": 1,
      "createdAt": "2021-09-05T12:41:48.400Z",
      "updatedAt": "2021-09-05T12:41:48.400Z"
    },
    {
      "id": 2,
      "title": "Title Post DEF",
      "content": "Content Post DEF",
      "userId": 1,
      "createdAt": "2021-09-05T12:41:48.400Z",
      "updatedAt": "2021-09-05T12:41:48.400Z"
    }
  ]
}
```

## Biometric Authentication API

After ensuring the User model works fine, we can start touching the Authentication API. Here is the list of endpoints we will create.

<table>
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/register</td>
    <td>Register a new user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/login</td>
    <td>Authenticate user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/refreshbiometric</td>
    <td>Refresh biometric token for a user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/refreshtoken</td>
    <td>Refresh JWT token for a user</td>
  </tr>
</table>

Let's start to prepare JWT token by adding `JWT_SECRET` into file `.env`. You can use any string you want, or use generated random key from [randomkeygen](https://randomkeygen.com/).

Just make sure it's stay secret. 
Don't include it into git repo or share it with anyone.

```
HOST = 3000
DB_HOST = '127.0.0.1'
DB_USERNAME = ''
DB_PASSWORD = ''
DB_NAME = 'bioauth'
DB_DIALECT = 'postgres'
JWT_SECRET = 'bioauth-super-secret'
```

Then create configuration file `app/config/auth.js`

```js
module.exports = {
  secret: process.env.JWT_SECRET
};
```

Now we can prepare boilerplate code for controller `app/controllers/authController.js`

```js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { secret } = require('../config/auth');
const { User } = require('../models');

const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.register = async (req, res) => {
  
};

exports.login = async (req, res) => {
  
};

exports.refreshBiometric = async (req, res) => {

};

exports.refreshToken = async (req, res) => {

};
```

And edit `app/controllers/index.js`

```js
const postController = require('./postController');
const userController = require('./userController');
const authController = require('./authController');

module.exports = { 
  postController, 
  userController,
  authController
};
```

And then applying it to `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { 
  postController,
  userController,
  authController 
} = require('../controllers');

const { profile } = userController;

const { 
  register, 
  login,
  refreshBiometric,
  refreshToken 
} = authController;

...

router.post('/register', register);
router.post('/login', login);
router.post('/biometric', refreshBiometric);
router.post('/token', refreshToken);

module.exports = router;
```

Now after the routes are ready, we can start filling in each functionality of `authController`

Let's start with `register`

```js
exports.register = async (req, res) => {
  const { 
    username, 
    password, 
    email 
  } = req.body;

  const biometricSecret = `${secret}.${username}.${Date.now()}`;
  const biometricToken = bcrypt.hashSync(biometricSecret);

  try {
    const user = await User.create({
      username: username,
      password: bcrypt.hashSync(password),
      biometric: bcrypt.hashSync(biometricToken),
      email: email
    });

    if (user) {
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        biometricToken: biometricToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Create user failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

This register function works like a normal user registration, but with a little bit of extra logic to handle biometric authentication.

Normally, it is enough to store hashed password in the database, but now we also create biometric token and store its hashed value in the database.

This biometric token will be sent to client as part of the response, and it will be saved in local storage using biometric encryption. And then the client can use it as an alternative login method.

Normally client can login with username and password, but now they can also login by sending username and its associated biometric token.

`biometricToken` is actually hashed value of `biometricSecret`, where `biometricSecret` is unique string generated by combining the auth secret with username and current timestamp.

Just like we only store the hashed password in the database, we also store the hashed biometric token in the database. So in case of a data breach, nobody can guess the real biometric token from its hashed value.

Now let's start implementing `login`

```js
exports.login = async (req, res) => {
  const { 
    username, 
    password, 
    biometric 
  } = req.body;

  const hasPassword = password;
  const hasBiometric = biometric;
  const hasCredentials = hasPassword || hasBiometric;
  const message = 'Invalid credentials';

  if (!username || !hasCredentials) {
    return res.status(BAD_REQUEST).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({
      where: { username: username }
    });

    if (!user) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: message
      });
    }

    // check validity of password if login with password
    if (hasPassword) {
      const isPasswordValid = bcrypt.compareSync(
        password, 
        user.password
      );

      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    // check validity of biometric if login with biometric
    if (hasBiometric) {
      const isBiometricValid = bcrypt.compareSync(
        biometric, 
        user.biometric
      );

      if (!isBiometricValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    const payload = { 
      id: user.id, 
      username: user.username 
    };

    const token = jwt.sign(payload, secret, { 
      expiresIn: 86400 
    });

    return res.json({
      id: user.id,
      username: user.username,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: message
    });
  }
};
```

In a normal authentication, we only check validity of combination of username and password, but now we also check the validity of biometric token.

The response of both `login` method will send jwt token that can be used later to authenticate user when accessing parts of restricted APIs.

So biometric token will only be used once when user try to login with biometric. It's not replacement for jwt token for the rest of the application.

## Register Middleware

Before we continue with the other parts of `authController` (`refreshBiometric` and `refreshToken`), let's first handle the middleware to complete the `register` function.

The code we use to implement `register` is not checking whether the parameters sent by client are complete, and whether the username is already taken.

For that, we need to create middleware `app/middleware/checkRegister.js` that implements `checkRegisterParams` and `checkDuplicateUsername`

```js
const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.checkRegisterParams = (req, res, next) => {
  const { 
    username, 
    email, 
    password 
  } = req.body;

  if (username && password && email) {
    next();
  } else {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete parameters'
    });
  }
};

exports.checkDuplicateUsername = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ 
      where : { username: username } 
    });

    if (user) {
      return res.status(BAD_REQUEST).json({ 
        message: `Username ${username} is already taken` 
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And create file `app/middleware/index.js`

```js
const checkRegister = require('./checkRegister');

module.exports = { checkRegister };
```

And then apply it to route `/register` inside `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { checkRegister } = require('../middleware');
const { checkRegisterParams, checkDuplicateUsername } = checkRegister;

...

router.post(
  '/register', 
  [ checkRegisterParams, checkDuplicateUsername ], 
  register
);

...

```

## Auth Middleware

We also need to create another middleware to check whether the user is authenticated before accessing restricted API.

For that, we need to create file `app/middleware/checkAuth.js`

```js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth');

const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST } = StatusCodes;

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(BAD_REQUEST).json({
      message: 'No Authentication Token'
    });
  }

  jwt.verify(token, secret, (error, data) => {
    if (data) {
      req.userId = data.id;
      req.username = data.username;
      next();
    } 
    else {
      if (error && error instanceof TokenExpiredError) {
        return res.status(BAD_REQUEST).json({
          message: 'Access token was expired'
        });
      }

      return res.status(BAD_REQUEST).json({
        message: 'Invalid Token'
      });
    }
  });
};
```

And update file `app/middleware/index.js`

```js
const checkRegister = require('./checkRegister');
const checkAuth = require('./checkAuth');

module.exports = { checkRegister, checkAuth };
```

And then apply the middleware to `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { checkRegister, checkAuth } = require('../middleware');
const { checkRegisterParams, checkDuplicateUsername } = checkRegister;
const { verifyToken } = checkAuth;

const { 
  postController,
  userController,
  authController 
} = require('../controllers');

const { profile } = userController;

const { 
  register, 
  login,
  refreshBiometric,
  refreshToken 
} = authController;

const {
  searchPost,
  findPost,
  createPost,
  updatePost,
  deletePost,
  deleteAllPost
} = postController;

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/posts', searchPost);
router.get('/posts/:id', findPost);
router.post('/posts', [ verifyToken ], createPost);
router.put('/posts/:id', [ verifyToken ],  updatePost);
router.delete('/posts/:id', [ verifyToken ],  deletePost);
router.delete('/posts', [ verifyToken ], deleteAllPost);

// add route for user's own profile with verifyToken
router.get('/profile', [ verifyToken ], profile);
router.get('/profile/:username', profile);

router.post(
  '/register', 
  [ checkRegisterParams, checkDuplicateUsername ], 
  register
);

router.post('/login', login);
router.post('/refreshbiometric', refreshBiometric);
router.post('/refreshtoken', refreshToken);

module.exports = router;
```

## Role Middleware

Is it done? Not yet.

Before continuing with `refreshBiometric` and `refreshToken`, we need to ensure all routes can only be accessed by its authorized users.

Let's see.

First, we have route put and delete of `/posts/:id` which can be accessed by every logged in users. We need to make sure that only the user who create a post can update or delete that post.

Next, we also have route delete of `/posts` which also can be accessed by every logged in users. We need to make sure this feature is only for admin.

For that we need to create `app/middleware/checkRole.js` implementing `isAdmin` and `isAuthor`

```js
const { Post } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.isAdmin = async (req, res, next) => {
  // For now, we stick with a simple username check
  // For more complex use case, we need to create role table
  // and use it to check the role of the user
  if (req.username === 'admin') {
    next();
  } else {
    return res.status(UNAUTHORIZED).json({
      message: 'Not authorized. Access admin only.'
    });
  }
};

exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (post && post.userId === req.userId) {
      next();
    } else {
      return res.status(UNAUTHORIZED).json({
        message: 'Not authorized.'
      });
    }
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And then edit `app/middleware/index.js`

```js
const checkRegister = require('./checkRegister');
const checkAuth = require('./checkAuth');
const checkRole = require('./checkRole');

module.exports = { 
  checkRegister, 
  checkAuth,
  checkRole 
};
```

And apply the middleware to `app/routes/index.js`

```js
const express = require('express');
const router = express.Router();

const { 
  checkRegister, 
  checkAuth,
  checkRole 
} = require('../middleware');

const { checkRegisterParams, checkDuplicateUsername } = checkRegister;
const { verifyToken } = checkAuth;
const { isAdmin, isAuthor } =  checkRole;

const { 
  postController,
  userController,
  authController 
} = require('../controllers');

const { profile } = userController;

const { 
  register, 
  login,
  refreshBiometric,
  refreshToken 
} = authController;

const {
  searchPost,
  findPost,
  createPost,
  updatePost,
  deletePost,
  deleteAllPost
} = postController;

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/posts', searchPost);
router.get('/posts/:id', findPost);
router.post('/posts', [ verifyToken ], createPost);
router.put('/posts/:id', [ verifyToken, isAuthor ],  updatePost);
router.delete('/posts/:id', [ verifyToken, isAuthor ],  deletePost);
router.delete('/posts', [ verifyToken, isAdmin ], deleteAllPost);

router.get('/profile', [ verifyToken ], profile);
router.get('/profile/:username', profile);

router.post(
  '/register', 
  [ checkRegisterParams, checkDuplicateUsername ], 
  register
);

router.post('/login', login);
router.post('/refreshbiometric', refreshBiometric);
router.post('/refreshtoken', refreshToken);

module.exports = router;
```

## Refresh Biometric Token

Refresh biometric happens when user need to replace the old biometric token with a new one. This is usually done when user remove biometric credential from their application and then want to add the new one.

To refresh biometric token, we need to edit `refreshBiometric` function in `app/controllers/authController.js`

```js
exports.refreshBiometric = async (req, res) => {
  const { userId, username } = req;

  const biometricSecret = `${secret}.${username}.${Date.now()}`;
  const biometricToken = bcrypt.hashSync(biometricSecret);
  const biometric = bcrypt.hashSync(biometricToken);
  
  try {
    const data = await User.update({ biometric }, { 
      where: { username },
    });
    
    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (updated) {
      return res.json({
        id: userId,
        username: username,
        biometricToken: biometricToken
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Refresh biometric failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};
```

And then edit `/refreshbiometric` route in `app/routes/index.js` to use `verifyToken` middleware. 

This means the `/refreshbiometric` API can only be used when the user is already logged in to the application.

```js
...

router.post('/refreshbiometric', [ verifyToken ], refreshBiometric);

...
```

## Sanity Test 

Before we continue our journey into `refreshToken`, we need to make sure the application is working as we want. To do this, we use Postman to test the authentication API.

For 1st test, we will login with `admin` and password `1234`. 
Don't forget to use POST method.

![](https://i.ibb.co/PgFwt9K/bioauth-login.png)

It will return login response with token.

```json
{
  "id": 1,
  "username": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYzMDg2OTE4MSwiZXhwIjoxNjMwOTU1NTgxfQ.2Kxfu808NBOPtyPLGEmQnsQPDXmrxerpPUJM6sMf-d8"
}
```

Now we can try to GET admin `profile`. Copy the token from login response into `x-access-token` header. 

![](https://i.ibb.co/q0bxcxq/bioauth-profile.png)

It will return admin profile, complete with its posts.

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@bioauth.com",
  "posts": [
    {
      "id": 1,
      "title": "Title Post ABC",
      "content": "Content Post ABC",
      "userId": 1,
      "createdAt": "2021-09-05T12:41:48.400Z",
      "updatedAt": "2021-09-05T12:41:48.400Z"
    },
    {
      "id": 2,
      "title": "Title Post DEF",
      "content": "Content Post DEF",
      "userId": 1,
      "createdAt": "2021-09-05T12:41:48.400Z",
      "updatedAt": "2021-09-05T12:41:48.400Z"
    }
  ]
}
```

Feel free to try the same test for Post API (createPost, updatePost, deletePost, etc)

Now let's try register a new user with username `salkuadrat`, email `uptoyou@gmail.com` and password `ss1234`.

![](https://i.ibb.co/tHywDmQ/bioauth-register.png)

It will return response as follows (with biometricToken).

```json
{
  "id": 2,
  "username": "salkuadrat",
  "email": "uptoyou@gmail.com",
  "biometricToken": "$2a$10$xnFMaqljYUR5b5XbBhL4UOS2QyisHlxNlh35ngWzmjhEnDyBfkhp6",
  "createdAt": "2021-09-05T19:37:08.732Z",
  "updatedAt": "2021-09-05T19:37:08.732Z"
}
```

In real mobile application, biometricToken from this response will be saved in the device using biometric encryption. Then it can be used later to login with biometric credential, by calling login api with parameters username and biometric token.

Next, we will test the `refreshBiometric` API. To do that, let's do biometric login using the newly registered user.

![](https://i.ibb.co/BTrM6gN/bioauth-login-biometric.png)

If it's goes well, it will return the same login response with token as login with username and password.

```json
{
  "id": 2,
  "username": "salkuadrat",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJzYWxrdWFkcmF0IiwiaWF0IjoxNjMwODcxMDAyLCJleHAiOjE2MzA5NTc0MDJ9.fPAulRHk_8C_EYtw6-hMdHqUriG89wUPeYzJ4VuZy04"
}
```

And then we use the token to test `refreshBiometric` API. Copy the token from login response into `x-access-token` header.

![](https://i.ibb.co/Dr6z7hN/bioauth-refresh-biometric.png)

We can see it returns json response with a newly generated biometricToken.

```json
{
  "id": 2,
  "username": "salkuadrat",
  "biometricToken": "$2a$10$/bEEjZX2j57kFHhLcGuD2ePcAUV3FQo4/aVq1hnA1HRbn9G.oFbNG"
}
```

After ensuring that register, login and refresh biometric works, now we can continue to the next step.

## Refresh JWT Token

Essentially, there are 2 main ways to refresh JWT token.

1. Refresh JWT token by forcing user to re-login
2. Refresh JWT token by calling refresh token API

For most applications, you can be fine with using the first way. You can set token expiration time to a longer period, so you won't need to deal with refreshing token regularly.

But, in case you have to use short period of token expiration time, you can use the second way.

To do this, we need to add additional columns to user model: `refreshToken` and `refreshTokenCreatedAt`

Let's do it by creating a new migration file.

```bash
$ sequelize-cli migration:generate --name add-refreshToken
```

It will generate migration file at `app/migrations/...-add-refreshToken.js`, which we can fill with the following code.

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'refreshToken', Sequelize.STRING);
    queryInterface.addColumn('Users', 'refreshTokenCreatedAt', Sequelize.DATE);
    return;
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'refreshToken');
    queryInterface.removeColumn('Users', 'refreshTokenCreatedAt');
    return;
  }
};
```

And then, run this command to apply migration to the database.

```bash
$ sequelize-cli db:migrate
```

Now if you check your PostgreSQL database using pgAdmin or DBeaver, you will see the new columns at `Users` table.

Don't forget to update `app/models/user.js` file.

```js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
  };

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    biometric: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    refreshTokenCreatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};
```

Now we also need to update the `login` API to generate new `refreshToken`

```js
exports.login = async (req, res) => {
  const { 
    username, 
    password, 
    biometric 
  } = req.body;

  const hasPassword = password;
  const hasBiometric = biometric;
  const hasCredentials = hasPassword || hasBiometric;
  const message = 'Invalid credentials';

  if (!username || !hasCredentials) {
    return res.status(BAD_REQUEST).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({
      where: { username: username }
    });

    if (!user) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: message
      });
    }

    // check validity of password if login with password
    if (hasPassword) {
      const isPasswordValid = bcrypt.compareSync(
        password, 
        user.password
      );

      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    // check validity of biometric if login with biometric
    if (hasBiometric) {
      const isBiometricValid = bcrypt.compareSync(
        biometric, 
        user.biometric
      );

      if (!isBiometricValid) {
        return res.status(BAD_REQUEST).json({
          message: message
        });
      }
    }

    const refreshTokenPlain = `refreshToken-${secret}.${username}.${Date.now()}`;
    const refreshToken = bcrypt.hashSync(refreshTokenPlain);

    const data = await User.update({
      refreshToken: bcrypt.hashSync(refreshToken),
      refreshTokenCreatedAt: new Date()
    }, {
      where: { username: username }
    });

    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (!updated) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Failed at updating refreshToken'
      });
    }

    const payload = { 
      id: user.id, 
      username: user.username 
    };

    // jwt token will be expired after 24 hours
    // feel free to change it according to your app requirements
    const token = jwt.sign(payload, secret, { 
      expiresIn: 86400 
    });

    return res.json({
      id: user.id,
      username: user.username,
      refreshToken: refreshToken,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: message
    });
  }
};
```

Let's test our updated `login` API.

![](https://i.ibb.co/7YzDBC1/bioauth-refresh-Token.png)

If it goes well, you will see the response containing refreshToken.

```json
{
  "id": 1,
  "username": "admin",
  "refreshToken": "$2a$10$rGYmhLdmWQiqaG/3Ex.SP.gwtgJM6NUEUZ3.3pekQImH89N5qXHzm",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYzMDg4MDI3MSwiZXhwIjoxNjMwOTY2NjcxfQ.uOZfKzlNXaRcnORvTz8buGjfFTHS_KUqoziaum0laBo"
}
```

You can also check the affected rows in the database. You will see the new value of refreshToken and refreshTokenCreatedAt.

Please note that the value of refreshToken in the database will not be the same with the value of refreshToken in the response. Since like column password and biometric, the value that we save is the hashed value of refreshToken.

Now it's time to complete the `refreshToken` function in `app/controllers/authController.js`

```js
...

const { StatusCodes } = require('http-status-codes');
const { FORBIDDEN, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

...

exports.refreshToken = async (req, res) => {
  const {
    username,
    refreshToken
  } = req.body;

  const message = 'Invalid credentials';

  if (!username || !refreshToken) {
    return res.status(BAD_REQUEST).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: message
      });
    }

    const isRefreshTokenValid = bcrypt.compareSync(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) {
      return res.status(BAD_REQUEST).json({
        message: message
      });
    }

    // check refreshToken expiration time
    const refreshTokenCreatedAt = user.refreshTokenCreatedAt;
    // diff value in seconds
    const diff = Math.round((Date.now() - refreshTokenCreatedAt.getTime()) / 1000);

    // refreshToken will be expired after 3 days
    // feel free to change it according to your app requirements
    const isExpired = diff > (3 * 86400);

    if (isExpired) {
      return res.status(FORBIDDEN).json({
        message: 'Refresh token was expired. Please make a new login request'
      });
    }

    const payload = { 
      id: user.id, 
      username: user.username 
    };

    // jwt token will be expired after 24 hours
    // feel free to change it according to your app requirements
    const token = jwt.sign(payload, secret, { 
      expiresIn: 86400 
    });

    return res.json({
      id: user.id,
      username: user.username,
      refreshToken: refreshToken,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: message
    });
  }
};
```

For the final blow, let's test our updated `refreshToken`. If it all goes well, you will see response containing the new token.

![](https://i.ibb.co/hfZnPDQ/bioauth-refresh-Token.png)

```json
{
  "id": 1,
  "username": "admin",
  "refreshToken": "$2a$10$rGYmhLdmWQiqaG/3Ex.SP.gwtgJM6NUEUZ3.3pekQImH89N5qXHzm",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYzMDg4MjA5OCwiZXhwIjoxNjMwOTY4NDk4fQ.M2pQwXskq1CKU8wifsaNJDCmHws63_XhAj-ot3NZ8dA"
}
```

## Final Steps 

It's all finished. Now we are ready to use this backend with our Flutter app. But first, we have to make it public using [ngrok](https://ngrok.com/).

Run server.

```bash
$ npm run dev
```

Make the server public with ngrok.

```bash
$ ngrok http 3000
```

Use the randomly generated ngrok URL as base URL in your Flutter app.

```
ngrok by @inconshreveable

Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://92832de0.ngrok.io -> localhost:3000
Forwarding                    https://92832de0.ngrok.io -> localhost:3000
```