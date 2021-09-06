require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.envDB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
  },
  "test": {
    "use_env_variable": "DATABASE_URL"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
};