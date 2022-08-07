const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Поле `Имя` должно быть не короче 2 символов'],
      maxlength: [30, 'Поле `Имя` должно быть не длиннее 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Поле `О себе` должно быть не короче 2 символов'],
      maxlength: [30, 'Поле `О себе` должно быть не длиннее 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Не введен адрес электронной почты'],
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: (props) => `${props.value} некорретный email`,
      },
    },
    password: {
      type: String,
      required: [true, 'Не введен пароль'],
      minlength: [8, 'Поле `Пароль` должно быть не короче 8 символов'],
      select: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('user', userSchema);
