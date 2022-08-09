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
  validateCardId,
} = require('../middlewares/requestValidation');

// Получение всех карточек
router.get('/', getCards);
// Создание карточки
router.post('/', validateCreateCard, createCard);
// Удаление карточки
router.delete('/:cardId', validateCardId, deleteCard);
// Добавление лайка
router.put('/:cardId/likes', validateCardId, addLike);
// Снятие лайка
router.delete('/:cardId/likes', validateCardId, removeLike);

module.exports = router;
