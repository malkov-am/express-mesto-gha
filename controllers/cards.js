// Импорты
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Получение всех карточек
function getCards(req, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
}

// Создание карточки
function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .catch((err) => {
      throw new BadRequestError({
        message: `Переданы некорректные данные при создании карточки: ${err.message}`,
      });
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

// Удаление карточки
function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Вы не являетесь автором карточки' });
      }
      Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch(next);
}

// Добавление лайка
function addLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

// Снятие лайка
function removeLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
