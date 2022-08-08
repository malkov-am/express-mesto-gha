// Импорты
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000 } = process.env;

// Middlewares
app.use(bodyParser.json());

// Роуты
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// Вход пользователя в систему
app.use(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
// Создание нового пользователя
app.use(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
// Неправильный URL
app.use('*', (req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Ресурс не найден. Проверьте URL и метод запроса.',
  });
  next();
});

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

// Запуск сервера
app.listen(PORT);
