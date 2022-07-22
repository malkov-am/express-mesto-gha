// Импорт модели
const Card = require('../models/card');
// Получение всех карточек
function getCards(req, res) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards));
}
// Создание карточки
function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user }).then((card) => res.send(card));
}
// Удаление карточки
function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ message: 'Пост удалён' }));
}
// Добавление лайка
function addLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card));
}
// Снятие лайка
function removeLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
