# Реестр контактов

Небольшое fullstack-приложение: список контактов с поиском, сортировкой, фильтром по статусу и пагинацией; просмотр карточки, создание, редактирование и удаление.

Монорепозиторий:
- `backend/` - REST API на Express + TypeScript + MySQL
- `frontend/` - SPA на React + TypeScript + Vite

## Стек

**Backend**
- Node.js, Express, TypeScript (`tsx`)
- MySQL (`mysql2/promise`)
- Zod - валидация на входе API
- Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)
- Vitest + Supertest — тесты HTTP-слоя

**Frontend**
- React, TypeScript, Vite
- TanStack Query - запросы и кеш
- React Hook Form + Zod (`@hookform/resolvers`) - формы
- React Router v6
- dayjs - форматирование дат
- lucide-react - иконки
- Vitest + Testing Library

## Установка

```bash
# backend
cd backend
npm install
cp .env.example .env       # заполнить креды MySQL
npm run seed       # создаёт БД, таблицу и 50 контактов

# frontend
cd ../frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:3001/api
```

## Переменные окружения

### `backend/.env`

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=contacts_db
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:3001/api
```

## Запуск

Два терминала:

```bash
# backend — http://localhost:3001
cd backend
npm run dev

# frontend — http://localhost:5173
cd frontend
npm run dev
```

- Приложение: http://localhost:5173
- Swagger UI: http://localhost:3001/api-docs
- OpenAPI JSON: http://localhost:3001/api-docs.json
- Health: http://localhost:3001/api/health

## API

Базовый префикс: `/api`.

| Метод    | Путь                | Описание                                                    |
|----------|---------------------|-------------------------------------------------------------|
| `GET`    | `/health`           | Проверка сервера                                    |
| `GET`    | `/contacts`         | Список с поиском, сортировкой, фильтром и пагинацией        |
| `GET`    | `/contacts/:id`     | Один контакт                                                |
| `POST`   | `/contacts`         | Создание                                                    |
| `PUT`    | `/contacts/:id`     | Полное обновление                                           |
| `DELETE` | `/contacts/:id`     | Удаление                                                    |


## Скрипты

### Backend

```bash
npm run dev        # tsx watch
npm run build      # tsc → dist/
npm start          # node dist/index.js
npm test           # vitest run
npm run test:watch # vitest в watch-режиме
npm run seed       # создаёт БД, таблицу и 50 контактов
```

### Frontend

```bash
npm run dev         # vite
npm run build       # tsc + vite build
npm run preview     # предпросмотр сборки
npm run test        # vitest в watch-режиме
npm run test:run    # один прогон (CI)
```


## Что бы доделал с большим временем
- **Увеличил бы процент покрытия тестами**
- **Адаптив под разные устройства**
- **e2e на Playwright**
- **Cинхронизировал бы состояние фильтров с query-параметрами URL (?search=...&status=...&page=...)**
- **Миграции через Prisma**
