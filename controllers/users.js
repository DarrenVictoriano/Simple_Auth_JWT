const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = {
  add: (req, res) => {

    let result = {};
    let status = 201;

    const { name, password } = req.body;
    console.log(req.body);
    const user = new User({ name, password });

    console.log(user);

    user.save((err, user) => {
      if (err) {
        status = 500;
        result.status = status;
        result.error = err;
        console.log(err);
      } else {
        result.status = status;
        result.result = user;
      }
      res.status(status).json(result);
    });

  },

  login: (req, res) => {
    const { name, password } = req.body;

    let result = {};
    let status = 200;

    User.findOne({ name }, (err, user) => {
      if (!err && user) {
        // We could compare passwords in our model instead of below as well
        bcrypt.compare(password, user.password).then(match => {
          if (match) {
            status = 200;
            // Create a token
            const payload = { user: user.name };
            const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);

            result.token = token;
            result.status = status;
            result.result = user;
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            console.log(err);
          }
          res.status(status).json(result);
        }).catch(err => {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).json(result);
        });
      } else {
        status = 404;
        result.status = status;
        result.error = err;
        res.status(status).json(result);
      }
    });

  },

  getAll: (req, res) => {

    let result = {};
    let status = 200;

    const payload = req.decoded;
    console.log(payload);
    if (payload && payload.user === 'admin') {
      User.find({}, (err, users) => {
        if (!err) {
          result.status = status;
          result.error = err;
          result.result = users;
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          console.log(err);
        }
        res.status(status).json(result);
      });
    } else {
      status = 401;
      result.status = status;
      result.error = `Authentication error`;
      res.status(status).json(result);
    }

  }
};