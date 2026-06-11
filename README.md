# Kanban Board

## База данных (локальный PostgreSQL + pgAdmin)

### 1. Создайте базу в pgAdmin

1. Откройте pgAdmin и подключитесь к локальному серверу PostgreSQL.
2. ПКМ на **Databases** → **Create** → **Database…**
3. Имя: `kanban` → **Save**.

### 2. Примените схему

1. ПКМ на базе `kanban` → **Query Tool**.
2. Откройте файл `init/01_init.sql`, вставьте содержимое в редактор.
3. Нажмите **Execute** (F5).

### 3. Подключение backend

```powershell
copy server\.env.example server\.env
```

Отредактируйте `server/.env` — укажите свой пароль PostgreSQL:

```
DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/kanban
```

### 4. Запуск сервера

```powershell
cd server
npm install
npm run dev
```

API: http://localhost:5000

---

### Параметры подключения в pgAdmin

| Параметр | Значение |
|----------|----------|
| Host     | `localhost` |
| Port     | `5432` |
| Database | `kanban` |
| User     | `postgres` |
| Password | ваш пароль при установке PostgreSQL |

---

Папка `data/` в корне проекта — это старые данные от Docker. Её можно удалить, если Docker больше не используется.
