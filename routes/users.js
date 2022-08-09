const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  validateGetUser,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/requestValidation');

// Получение всех пользователей
router.get('/', getUsers);
// Получение информации о пользователе
router.get('/me', getUserInfo);
// Получение пользователя по id
router.get('/:userId', validateGetUser, getUser);

// Обновление данных пользователя
router.patch('/me', validateUpdateProfile, updateProfile);
// обновление аватара поьзователя
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
