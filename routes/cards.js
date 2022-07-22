const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

// Получение всех карточек
router.get('/', getCards);
// Создание карточки
router.post('/', createCard);
// Удаление карточки
router.delete('/:cardId', deleteCard);
// Добавление лайка
router.put('/:cardId/likes', addLike);
// Снятие лайка
router.delete('/:cardId/likes', removeLike);

module.exports = router;
