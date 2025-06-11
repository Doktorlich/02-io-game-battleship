# **Морской бой (IO Game) - Документация**
Проект представляет собой онлайн-версию игры «Морской бой» с возможностью игры в реальном времени.

**Стек технологий:**
- **Frontend:** HTML, SCSS, TypeScript, WebSocket
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, WebSocket

---

## **📌 Backend**
### **Функционал**
✅ **Аутентификация** (JWT)  
✅ **Лобби** (создание/поиск игр)  
✅ **Игровая механика** (расстановка кораблей, выстрелы, победа)  
✅ **WebSocket** (реальное время)

### **Структура**
```
/backend  
│── /src  
│   │── /config                 # Конфигурации (DB, JWT, CORS)  
│   │   │── db.ts               # Подключение к MongoDB  
│   │   │── env.ts              # Валидация переменных окружения  
│   │  
│   │── /controllers            # Логика обработки запросов  
│   │   │── auth.controller.ts  # Регистрация, вход  
│   │   │── game.controller.ts  # Создание/поиск игр  
│   │   │── user.controller.ts  # Профили, рейтинги  
│   │  
│   │── /models                # Схемы MongoDB  
│   │   │── user.model.ts       # Игрок (логин, пароль, рейтинг)  
│   │   │── game.model.ts       # Игра (доски, ходы, статус)  
│   │  
│   │── /routes                # Роуты Express  
│   │   │── auth.routes.ts      # POST /auth/login  
│   │   │── game.routes.ts      # GET /games/available  
│   │   │── user.routes.ts      # GET /users/leaderboard  
│   │  
│   │── /sockets               # Логика WebSocket  
│   │   │── game.index.ts      # Обработчики game:attack, game:turn  
│   │   │── connection.ts       # Подключение/отключение игроков  
│   │  
│   │── /middlewares           # Промежуточные обработчики  
│   │   │── auth.middleware.ts  # Проверка JWT  
│   │   │── error.middleware.ts # Обработка ошибок  
│   │  
│   │── /services              # Бизнес-логика  
│   │   │── auth.service.ts     # Хэширование паролей  
│   │   │── game.service.ts     # Генерация поля, проверка ходов  
│   │  
│   │── /utils                 # Вспомогательные функции  
│   │   │── logger.ts          # Логирование запросов  
│   │   │── apiResponse.ts     # Стандартные ответы API  
│   │  
│   │── app.ts                 # Настройка Express (CORS, роуты)  
│   │── server.ts              # Запуск сервера + WebSocket  
│  
│── .env                       # Переменные окружения  
│── package.json  
│── tsconfig.json  
```

### **API Endpoints**
| Метод | Путь | Описание |  
|-------|------|----------|  
| POST  | `/auth/register` | Регистрация |  
| POST  | `/auth/login`    | Вход |  
| GET   | `/games/available` | Список игр |  
| POST  | `/games/create`  | Создать игру |  
| POST  | `/games/:id/join` | Присоединиться |  

### **WebSocket Events**
| Событие | Данные | Описание |  
|---------|--------|----------|  
| `game:start` | `{ gameId }` | Игра началась |  
| `game:turn`  | `{ playerId }` | Смена хода |  
| `game:attack` | `{ x, y, hit }` | Результат выстрела |  
| `game:over`  | `{ winnerId }` | Конец игры |  

---

## **📌 Frontend**
### **Функционал**
✅ **Авторизация/регистрация**  
✅ **Лобби** (список игр)  
✅ **Игровая комната** (доски, выстрелы)  
✅ **WebSocket** (обновления в реальном времени)

### **Структура**
```
/frontend  
│── /src  
│   │── /assets                # Статические файлы  
│   │   │── /images            # Иконки, фон  
│   │   │── /sounds            # Звуки выстрелов, победы  
│   │  
│   │── /css                   # Скомпилированный CSS  
│   │  
│   │── /scss                  # Исходные стили  
│   │   │── _variables.scss    # Цвета, шрифты  
│   │   │── _base.scss         # Сброс стилей  
│   │   │── _board.scss        # Стили игрового поля  
│   │   │── main.scss          # Главный файл стилей  
│   │  
│   │── /ts                    # TypeScript-код  
│   │   │── /api               # Запросы к backend  
│   │   │   │── auth.api.ts    # Авторизация  
│   │   │   │── game.api.ts    # Лобби, игры  
│   │   │  
│   │   │── /game              # Игровая логика  
│   │   │   │── board.ts       # Отрисовка и клики по доске  
│   │   │   │── ships.ts       # Расстановка кораблей  
│   │   │  
│   │   │── /sockets           # WebSocket  
│   │   │   │── game.index.ts # Подписка на события  
│   │   │  
│   │   │── /utils             # Вспомогательные функции  
│   │   │   │── helpers.ts     # Генерация случайных чисел  
│   │   │   │── storage.ts     # Работа с localStorage  
│   │   │  
│   │   │── app.ts             # Инициализация приложения  
│   │  
│   │── /pages                 # HTML-страницы  
│   │   │── index.html         # Авторизация  
│   │   │── lobby.html         # Лобби  
│   │   │── game.html          # Игровая комната  
│   │   │── profile.html       # Профиль  
│  
│── package.json  
│── tsconfig.json  
│── vite.config.ts             # Конфиг сборки (если используется Vite)  
```

### **Основные модули**
- **`auth.ts`** – работа с API авторизации
- **`sockets.ts`** – подключение к WebSocket
- **`game.ts`** – логика игры (доски, корабли)
- **`board.ts`** – отрисовка и обработка кликов

---

## **🚀 Установка и запуск**
### **Backend**
1. Установите зависимости:
   ```bash
   cd backend
   npm install
   ```  
2. Настройте `.env` (MongoDB, JWT-ключ).
3. Запустите сервер:
   ```bash
   npm run dev
   ```  

### **Frontend**
1. Установите зависимости:
   ```bash
   cd frontend
   npm install
   ```  
2. Запустите сборку:
   ```bash
   npm run dev
   ```  
3. Откройте `http://localhost:3000`.

---

## **🔗 Деплой**
- **Backend:** Render / Railway
- **Frontend:** Netlify / GitHub Pages

---

## **📝 Лицензия**
MIT License.
