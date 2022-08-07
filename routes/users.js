const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// Получение всех пользователей
router.get('/', getUsers);
// Получение информации о пользователе
router.get('/me', getUserInfo);
// Получение пользователя по id
router.get('/:userId', getUser);
// Создание нового пользователя
router.post('/', createUser);
// Обновление данных пользователя
router.patch('/me', updateProfile);
// обновление аватара поьзователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
