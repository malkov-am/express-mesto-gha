// Импорты
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
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
    const { name, about, avatar } = req.body;
    const userData = await User.create({ name, about, avatar });
    res.send(userData);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при создании пользователя: ${err.message}`,
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
