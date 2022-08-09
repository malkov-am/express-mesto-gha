const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateDeleteCard,
  validateLike,
} = require('../middlewares/requestValidation');

// Получение всех карточек
router.get('/', getCards);
// Создание карточки
router.post('/', validateCreateCard, createCard);
// Удаление карточки
router.delete('/:cardId', validateDeleteCard, deleteCard);
// Добавление лайка
router.put('/:cardId/likes', validateLike, addLike);
// Снятие лайка
router.delete('/:cardId/likes', validateLike, removeLike);

module.exports = router;
