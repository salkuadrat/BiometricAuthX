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
    "use_env_variable": "DATABASE_URL",
    "dialect": process.env.DB_DIALECT,
    "protocol": process.env.DB_DIALECT,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": process.env.DB_DIALECT,
    "protocol": process.env.DB_DIALECT,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
};