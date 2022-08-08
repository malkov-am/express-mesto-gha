const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
      validate: {
        validator(link) {
          return /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+$/.test(link);
        },
        message: (props) => `${props.value} некорретный URL`,
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Не введен адрес электронной почты'],
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: (props) => `${props.value} некорретный адрес электронной почты`,
      },
    },
    password: {
      type: String,
      required: [true, 'Не введен пароль'],
      minlength: [8, 'Поле `Пароль` должно быть не короче 8 символов'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError({ message: 'Неправильные email или пароль' });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError({ message: 'Неправильные email или пароль' });
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
