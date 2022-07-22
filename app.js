const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Запуск сервера
app.listen(PORT);
