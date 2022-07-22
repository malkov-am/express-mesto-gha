// Импорт модели
const User = require('../models/user');
// Получение всех пользователей
function getUsers(req, res) {
  User.find({}).then((usersData) => {
    res.send(usersData);
  });
}
// Получение пользователя по id
function getUser(req, res) {
  User.findById(req.user._id).then((userData) => res.send(userData));
}
// Создание нового пользователя
function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((userData) => res.send(userData));
}
// Обновление профиля
function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true }).then(
    (updatedUserData) => res.send(updatedUserData)
  );
}
// Обновление аватара
function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true }).then(
    (updatedUserData) => res.send(updatedUserData)
  );
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
