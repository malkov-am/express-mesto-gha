// Импорт модели
const Card = require('../models/card');
// Получение всех карточек
async function getCards(req, res) {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    res.status(500).send({
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
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        break;

      default:
        res.status(500).send({
          message: 'Внутренняя ошибка сервера.',
        });
    }
  }
}
// Удаление карточки
async function deleteCard(req, res) {
  try {
    const cardToDelete = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardToDelete) {
      res.status(404).send({
        message: 'Карточка с указанным _id не найдена.',
      });
    } else {
      res.send({ message: 'Пост удалён' });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Внутренняя ошибка сервера.',
    });
  }
}
// Добавление лайка
async function addLike(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    res.send(card);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
        break;
      case 'CastError':
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
        break;

      default:
        res.status(500).send({
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
      { new: true },
    ).populate(['owner', 'likes']);
    res.send(card);
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
        break;
      case 'CastError':
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
        break;

      default:
        res.status(500).send({
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
