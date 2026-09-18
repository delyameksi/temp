import 'dotenv/config';
import mysql from 'mysql2';
import { DatabasePersistence } from '../types';
const {
  MYSQL_HOST: HOST,
  MYSQL_USER: USER,
  MYSQL_PASSWORD: PASSWORD,
  MYSQL_DB: DB,
} = process.env;

let pool: mysql.Pool | null = null;

export const mysqlPersistence: DatabasePersistence = {
  async init(): Promise<void> {
    if (!HOST || !PASSWORD || !DB) {
      throw new Error('Missing values .env');
    }

    const host = HOST || 'localhost';
    const user = USER || 'root';
    const password = PASSWORD || '';
    const database = DB || 'todos';

    console.log('HOST =', HOST);
    console.log('USER =', USER);
    console.log('DB =', DB);
    console.log('PASSWORD existe =', !!PASSWORD);
    console.log('PASSWORD longueur =', PASSWORD?.length);

    pool = mysql.createPool({
      connectionLimit: 5,
      host,
      user,
      password,
      database,
      charset: 'utf8mb4',
    });

    return new Promise((resolve, reject) => {
      pool!.query('SELECT 1', (err) => {
        if (err) {
          console.error('Erreur connexion MySQL :', err);
          reject(err);
          return;
        }

        console.log('Connexion MySQL réussie');
        resolve();
      });
    });
  },

  async getDatabase(): Promise<mysql.Pool> {
    if (!pool) {
      throw new Error('Database has not been initialized');
    }

    // add gestion d'erreur si la connexion échoue
    return pool;
  },

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!pool) return resolve();
      pool.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  // async getItems(): Promise<TodoItem[]> {
  //   return new Promise((resolve, reject) => {
  //     pool?.query("SELECT * FROM todo_items", (err, result) => {
  //       if (err) return reject(err);
  //       const rows = result as TodoItem[];
  //       const items = rows.map((row) => ({
  //         ...row,
  //         completed: Boolean(row.completed),
  //       }));
  //       resolve(items);
  //     });
  //   });
  // },

  /*
  async getItem(id: string): Promise<TodoItem | undefined> {
    return new Promise((resolve, reject) => {
      pool?.query(
        "SELECT * FROM todo_items WHERE id = ?",
        [id],
        (err, result) => {
          if (err) return reject(err);
          const rows = result as TodoItem[];
          resolve(rows[0]);
        },
      );
    });
  },

  async storeItem(item: TodoItem): Promise<void> {
    return new Promise((resolve, reject) => {
      pool?.query(
        "INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)",
        [item.id, item.name, item.completed],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  },

  async updateItem(id: string, item: Partial<TodoItem>): Promise<void> {
    return new Promise((resolve, reject) => {
      pool?.query(
        "UPDATE todo_items SET name = ?, completed = ? WHERE id = ?",
        [item.name, item.completed, id],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  },

  async removeItem(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      pool?.query("DELETE FROM todo_items WHERE id = ?", [id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },*/
};

export default mysqlPersistence;
