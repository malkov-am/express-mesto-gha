// Импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require('../utils/constants');
// Получение всех пользователей
async function getUsers(req, res) {
  try {
    const usersData = await User.find({});
    res.send(usersData);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({
      message: 'Внутренняя ошибка сервера.',
    });
  }
}

// Получение пользователя по id
async function getUser(req, res) {
  try {
    const userData = await User.findById(req.params.userId);
    if (!userData) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Пользователь по указанному _id не найден.',
      });
      return;
    }
    res.send(userData);
  } catch (err) {
    switch (err.name) {
      case 'CastError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Переданы некорректные данные при зпросе _id.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Создание нового пользователя
async function createUser(req, res) {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(CONFLICT_ERROR_CODE).send({
        message: 'Пользователь с данным email уже зарегестрирован.',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: 'Внутренняя ошибка сервера.',
      });
    }
  }
}
// Вход в систему
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(UNAUTHORIZED_ERROR_CODE).send({
        message: 'Неправильный email или пароль.',
      });
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(UNAUTHORIZED_ERROR_CODE).send({
        message: 'Неправильный email или пароль.',
      });
      return;
    }
    const token = jwt.sign(
      { _id: user._id },
      '24abcbc149fe562f21cb9a885e08109f84524c2504cc38a1d3b6d27e4c0492d1',
      {
        expiresIn: '7d',
      },
    );
    res.send({ token });
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(UNAUTHORIZED_ERROR_CODE).send({
          message: 'Неправильный email или пароль.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Обновление профиля
async function updateProfile(req, res) {
  try {
    const { name, about } = req.body;
    const updatedUserData = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUserData) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Пользователь по указанному _id не найден.',
      });
    } else {
      res.send(updatedUserData);
    }
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при обновлении профиля: ${err.message}`,
        });
        break;
      case 'CastError':
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Передан некорректный _id пользователя.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Обновление аватара
async function updateAvatar(req, res) {
  try {
    const { avatar } = req.body;
    const updatedUserData = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(updatedUserData);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при обновлении аватара: ${err.message}`,
        });
        break;
      case 'CastError':
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Передан некорректный _id пользователя.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Получение информации о пользователе
async function getUserInfo(req, res) {
  try {
    const userData = await User.findById(req.user._id);
    if (!userData) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Пользователь по указанному _id не найден.',
      });
      return;
    }
    res.send(userData);
  } catch (err) {
    switch (err.name) {
      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
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
