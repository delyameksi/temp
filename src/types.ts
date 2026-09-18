import mysql from 'mysql2';

export interface TodoUser {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
}

export interface TodoProject {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
}

export interface TodoItem {
  id: string;
  projectId?: string; // to change
  name: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  deadline?: Date;
}

export interface DatabasePersistence {
  init(): Promise<void>;
  teardown(): Promise<void>;
  getDatabase(): Promise<mysql.Pool>;
  // getItems(): Promise<TodoItem[]>;
  // getItem(id: string): Promise<TodoItem | undefined>;
  // storeItem(item: TodoItem): Promise<void>;
  // updateItem(id: string, item: Partial<TodoItem>): Promise<void>;
  // removeItem(id: string): Promise<void>;
}
