# Kanban Board

Веб-приложение для управления проектами по методологии Kanban. Позволяет создавать доски, колонки, задачи, комментарии и управлять доступом пользователей.

## Возможности

- Регистрация и авторизация пользователей
- JWT-аутентификация
- Создание и удаление досок
- Просмотр списка досок пользователя
- Создание и удаление колонок
- Создание, редактирование и удаление задач
- Добавление комментариев к задачам
- REST API на Node.js + Express
- База данных PostgreSQL
- Клиентская часть на React

---

## Стек технологий

### Frontend

- React
- React Router
- Axios
- CSS Modules

### Backend

- Node.js
- Express.js
- JWT
- bcrypt

### Database

- PostgreSQL

---

# Установка проекта

## 1. Клонирование репозитория

```bash
git clone https://github.com/tokarevvd06-dev/Kanban_board.git
cd Kanban_board
```

---

## 2. Настройка PostgreSQL

Установить PostgreSQL и создать новую базу данных.

Пример:

```sql
CREATE DATABASE kanban_board;
```

Название базы данных будет использоваться в сервере для подключения!

Перейти в Query Tool созданной БД и выполнить SQL-код из файла SQL.txt в папке DB_init вручную через pgAdmin.

---

## 3. Настройка Backend

Перейти в папку сервера:

```bash
cd server
```

Установить зависимости:

```bash
npm install
```

Создать файл `.env`.

Пример содержимого:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:ЛИЧНЫЙ_ПАРОЛЬ_ОТ_PGADMIN@localhost:5432/kanban_board
JWT_SECRET=supersecretkey
```

Название БД такое же как в pgAdmin!

Запуск сервера:

```bash
npm run dev
```

После запуска сервер будет доступен по адресу:

```text
http://localhost:5000
```

---

## 4. Настройка Frontend

Открыть новый терминал.

Перейти в папку клиента:

```bash
cd kanban-client
```

Установить зависимости:

```bash
npm install
```

Запуск клиента:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:3000
```

---

# API

## Авторизация

### Регистрация

```http
POST /api/auth/register
```

### Вход

```http
POST /api/auth/login
```

---

## Доски

### Получить все доски пользователя

```http
GET /api/boards
```

### Создать доску

```http
POST /api/boards
```

### Удалить доску

```http
DELETE /api/boards/:id
```

---

## Колонки

### Получить колонки доски

```http
GET /api/boards/:boardId/columns
```

### Создать колонку

```http
POST /api/columns
```

### Удалить колонку

```http
DELETE /api/columns/:id
```

---

## Задачи

### Получить задачи колонки

```http
GET /api/columns/:columnId/tasks
```

### Создать задачу

```http
POST /api/tasks
```

### Обновить задачу

```http
PUT /api/tasks/:id
```

### Удалить задачу

```http
DELETE /api/tasks/:id
```

---

## Комментарии

### Получить комментарии задачи

```http
GET /api/tasks/:taskId/comments
```

### Создать комментарий

```http
POST /api/comments
```

### Удалить комментарий

```http
DELETE /api/comments/:id
```

---

# Безопасность

В проекте реализованы:

- JWT-аутентификация
- Хеширование паролей через bcrypt
- Проверка прав доступа пользователя
