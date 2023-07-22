const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/notFounrError');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');

const { CREATED_CODE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      email, password: hash, name, about, avatar,
    }))
    .then((userData) => {
      const { _id } = userData;
      res
        .status(CREATED_CODE)
        .send({
          data: {
            _id, email, name,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при регистрации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;

  user.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден!');
      }
      return res.send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные!!'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return user.findUserByCredentials(email, password)
    .then((userData) => {
      if (userData) {
        const token = jwt.sign({ _id: userData._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  user.findById(userId)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден!');
      }
      const { email, name } = userData;
      res.send({ email, name });
    })
    .catch(next);
};
