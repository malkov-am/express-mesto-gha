// Импорты
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000 } = process.env;

// Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62dac2ac0036a2c6707b0604',
  };
  next();
});

// Роуты
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// Неправильный URL
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Ресурс не найден. Проверьте URL и метод запроса.',
  });
});

// Запуск сервера
app.listen(PORT);
