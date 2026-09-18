import { mysqlPersistence } from '../../persistence/mysql';
import { TodoUser } from '../../types';

export async function findAll(): Promise<TodoUser[]> {
  const db = await mysqlPersistence.getDatabase();
  const [rows] = await db.promise().query('SELECT * FROM todo_users');

  return rows as TodoUser[];
}

export async function findById(id: string): Promise<TodoUser | undefined> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_users WHERE id = ?', [id]);

  const items = rows as TodoUser[];

  return items[0];
}

export async function findByEmail(
  email: string
): Promise<TodoUser | undefined> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_users WHERE email = ?', [email]);

  const items = rows as TodoUser[];

  return items[0];
}

export async function create(item: TodoUser): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query(
    `INSERT INTO todo_users
     (id, name, email, hashedPassword)
     VALUES (?, ?, ?, ?)`,
    [item.id, item.name, item.email, item.hashedPassword]
  );
}

export async function update(
  id: string,
  item: Partial<TodoUser>
): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query(
    `UPDATE todo_users
     SET name = ?, email = ?, hashedPassword = ?
     WHERE id = ?`,
    [item.name, item.email, item.hashedPassword, id]
  );
}

export async function remove(id: string): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query('DELETE FROM todo_users WHERE id = ?', [id]);
}
