// Импорты
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateSignup, validateSignin } = require('./middlewares/requestValidation');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000 } = process.env;

// Middlewares
app.use(bodyParser.json());

// Маршруты, не требующие аутентификации
app.use('/signin', validateSignin, login);
app.use('/signup', validateSignup, createUser);
// Защищенные маршруты
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// Неправильный URL
app.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Ресурс не найден. Проверьте URL и метод запроса.' }));
});

// Обработчик ошибок celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT);
