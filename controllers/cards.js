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
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: `Переданы некорректные данные при создании карточки: ${err.message}`,
          }),
        );
      }
      return next(err);
    })
    .then((card) => {
      res.send(card);
    });
}

// Удаление карточки
function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return next(ForbiddenError({ message: 'Вы не являетесь автором карточки' }));
      }
      return Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: `Передан некорректный _id карточки: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Добавление лайка
function addLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: `Передан некорректный _id карточки: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

// Снятие лайка
function removeLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError({ message: 'Карточка с указанным _id не найдена.' }))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: `Передан некорректный _id карточки: ${err.message}`,
          }),
        );
      }
      return next(err);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
