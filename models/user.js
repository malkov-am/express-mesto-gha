const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле `Имя` должно быть не короче 2 символов'],
    maxlength: [30, 'Поле `Имя` должно быть не длиннее 30 символов'],
    required: [true, 'Не заполнено поле `Имя`'],
  },
  about: {
    type: String,
    minlength: [2, 'Поле `О себе` должно быть не короче 2 символов'],
    maxlength: [30, 'Поле `О себе` должно быть не длиннее 30 символов'],
    required: [true, 'Не заполнено поле `О себе`'],
  },
  avatar: {
    type: String,
    required: [true, 'Не заполнено поле `Аватар`'],
  },
});

module.exports = mongoose.model('user', userSchema);
