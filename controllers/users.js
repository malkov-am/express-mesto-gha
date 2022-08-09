// Импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
// Получение всех пользователей
function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
}

// Получение пользователя по id
function getUser(req, res, next) {
  User.findById(req.params.userId)
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: `Переданы некорректные данные при зпросе _id: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Создание нового пользователя
function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res.status(CREATED_CODE).send({
        _id: user._id,
        name,
        about,
        avatar,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message: `Пользователь с таким email уже зарегестрирован: ${err.message}`,
          }),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: `Переданы некорректные данные при регистрации пользователя: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Вход в систему
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '24abcbc149fe562f21cb9a885e08109f84524c2504cc38a1d3b6d27e4c0492d1',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
}

// Обновление профиля
function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((updatedUserData) => {
      res.send(updatedUserData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: `Переданы некорректные данные при обновлении профиля: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Обновление аватара
function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((updatedUserData) => {
      res.send(updatedUserData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: `Переданы некорректные данные при обновлении аватара: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Получение информации о пользователе
function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
