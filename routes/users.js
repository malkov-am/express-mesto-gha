const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// Получение всех пользователей
router.get('/', getUsers);
// Получение пользователя по id
router.get('/:userId', getUser);
// Создание нового пользователя
router.post('/', createUser);
// Обновление данных пользователя
router.patch('/me', updateProfile);
// обновление аватара поьзователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
