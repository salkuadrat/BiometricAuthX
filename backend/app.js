// import dependencies packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// express 
const express = require('express');
const app = express();

const routes = require('./app/routes');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// security packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome to Biometric Authentication Server');
});

module.exports = app;