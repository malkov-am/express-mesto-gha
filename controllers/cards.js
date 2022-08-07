// Импорты
const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');
// Получение всех карточек
async function getCards(req, res) {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({
      message: 'Внутренняя ошибка сервера.',
    });
  }
}
// Создание карточки
async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user });
    res.send(card);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при создании карточки: ${err.message}`,
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `${err.message} Внутренняя ошибка сервера.`,
        });
    }
  }
}
// Удаление карточки
async function deleteCard(req, res) {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Карточка с указанным _id не найдена.',
      });
      return;
    }
    if (card.owner._id.toString() !== req.user._id) {
      res.status(UNAUTHORIZED_ERROR_CODE).send({
        message: 'Вы не являетесь автором карточки',
      });
      return;
    }
    Card.findByIdAndRemove(req.params.cardId).then(() =>
      res.send({ message: 'Пост удалён' })
    );
  } catch (err) {
    switch (err.name) {
      case 'CastError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Передан некорректный _id карточки.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Добавление лайка
async function addLike(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate(['owner', 'likes']);
    if (!card) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Передан несуществующий _id карточки.',
      });
    } else {
      res.send(card);
    }
  } catch (err) {
    switch (err.name) {
      case 'CastError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Передан некорректный _id карточки.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Снятие лайка
async function removeLike(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate(['owner', 'likes']);
    if (!card) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Передан несуществующий _id карточки.',
      });
    } else {
      res.send(card);
    }
  } catch (err) {
    switch (err.name) {
      case 'CastError':
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: 'Передан некорректный _id карточки.',
        });
        break;

      default:
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
