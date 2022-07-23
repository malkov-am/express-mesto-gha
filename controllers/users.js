// Импорт модели
const User = require('../models/user');
// Получение всех пользователей
async function getUsers(req, res) {
  try {
    const usersData = await User.find({});
    res.send(usersData);
  } catch (err) {
    res.status(500).send({
      message: 'Внутренняя ошибка сервера.',
    });
  }
}

// Получение пользователя по id
async function getUser(req, res) {
  try {
    const userData = await User.findById(req.params.userId);
    if (!userData) {
      res.status(404).send({
        message: 'Пользователь по указанному _id не найден.',
      });
      return;
    }
    res.send(userData);
  } catch (err) {
    res.status(500).send({
      message: 'Внутренняя ошибка сервера.',
    });
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
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        break;

      default:
        res.status(500).send({
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
    res.send(updatedUserData);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        break;
      case 'CastError':
        res.status(404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
        break;

      default:
        res.status(500).send({
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
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        break;
      case 'CastError':
        res.status(404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
        break;

      default:
        res.status(500).send({
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
