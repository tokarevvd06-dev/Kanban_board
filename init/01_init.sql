CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE board_members (
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('owner', 'editor', 'viewer')),

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (board_id, user_id)
);


CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    board_id UUID NOT NULL
        REFERENCES boards(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    position INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE columns
ADD CONSTRAINT columns_board_position_unique
UNIQUE (board_id, position)
DEFERRABLE INITIALLY DEFERRED;


CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    column_id UUID NOT NULL
        REFERENCES columns(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    position INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tasks
ADD CONSTRAINT tasks_column_position_unique
UNIQUE (column_id, position)
DEFERRABLE INITIALLY DEFERRED;


CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    task_id UUID NOT NULL
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    author_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_board_members_user
ON board_members(user_id);

CREATE INDEX idx_board_members_board
ON board_members(board_id);

CREATE INDEX idx_columns_board
ON columns(board_id);

CREATE INDEX idx_tasks_column
ON tasks(column_id);

CREATE INDEX idx_comments_task
ON comments(task_id);

CREATE INDEX idx_comments_user
ON comments(author_id);
