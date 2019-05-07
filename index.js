require("dotenv").config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;

const routes = require('./routes/index.js');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


if (environment !== 'production') {
  app.use(logger('dev'));
}

app.use('/api/v1', routes(router));
// app.use('/api/v1', (req, res, next) => {
//   res.send('Hello');
//   next();
// });

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/loginTest";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(3000, () => {
  console.log(`Server now listening at localhost: 3000`);
});

module.exports = app;