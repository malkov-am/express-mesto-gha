const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле `Название` должно быть не короче 2 символов'],
    maxlength: [30, 'Поле `Название` должно быть не длиннее 30 символов'],
    required: [true, 'Не заполнено поле `Название`'],
  },
  link: {
    type: String,
    required: [true, 'Не заполнено поле `Ссылка`'],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: [true, 'Не получены данные о создателе карточки'],
  },
  likes: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
