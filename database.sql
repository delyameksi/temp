CREATE DATABASE IF NOT EXISTS todos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE todos;

CREATE TABLE IF NOT EXISTS todo_users (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashedPassword VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS todo_projects (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  owner_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_project_owner
    FOREIGN KEY (owner_id)
    REFERENCES todo_users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CREATE TABLE IF NOT EXISTS todo_items (
--   id VARCHAR(36) NOT NULL,
--   projectId VARCHAR(36) NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   description TEXT NULL,
--   status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
--   deadline DATETIME NULL,
--   PRIMARY KEY (id),
--   CONSTRAINT fk_task_project
--     FOREIGN KEY (projectId)
--     REFERENCES todo_projects(id)
--     ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS todo_items (
  id VARCHAR(36) NOT NULL,
  projectId VARCHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  deadline DATETIME NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;