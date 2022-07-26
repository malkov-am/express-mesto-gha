# Проект Mesto бэкенд
Сервис "Место" - интерактивная страница, куда можно добавлять фотографии, удалять их и ставить лайки.
В проекте реализована валидация входящих запросов библиотекой Joi. Для валидации запросов с id используется кастомная валидация на регулярном выражении. Схемы валидируются как стандартными средствами mongoose, так и библиотекой validator. Для создания токенов для защищенных маршрутов применяется библиотека bcrypt. Реализована централизованная обработка ошибок. Для приведения кода к единому стилю используются prettier и ESLint.

## При создании сайта использовались следующие технологии:
- Node.js
- Express.js
- MongoDB

## Директории

`/routes` — папка с файлами роутера
`/controllers` — папка с файлами контроллеров пользователя и карточки
`/models` — папка с файлами описания схем пользователя и карточки

Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload
