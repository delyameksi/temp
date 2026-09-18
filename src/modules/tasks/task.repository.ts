import { mysqlPersistence } from '../../persistence/mysql';
import { TodoItem } from '../../types';

// Whitelist of columns an update is allowed to touch. Column names cannot be
// bound as query parameters, so the SET clause is built from this list only.
const UPDATABLE_COLUMNS = [
  'projectId',
  'name',
  'description',
  'status',
  'deadline',
] as const;

export async function findAll(): Promise<TodoItem[]> {
  const db = await mysqlPersistence.getDatabase();
  const [rows] = await db.promise().query('SELECT * FROM todo_items');

  return rows as TodoItem[];
}

export async function findById(id: string): Promise<TodoItem | undefined> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_items WHERE id = ?', [id]);

  const tasks = rows as TodoItem[];

  return tasks[0];
}

export async function findByProject(projectId: string): Promise<TodoItem[]> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_items WHERE projectId = ?', [projectId]);

  return rows as TodoItem[];
}

export async function create(task: TodoItem): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query(
    `INSERT INTO todo_items
     (id, projectId, name, description, status, deadline)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.projectId,
      task.name,
      task.description ?? null,
      task.status,
      task.deadline ?? null,
    ]
  );
}

export async function update(
  id: string,
  task: Partial<TodoItem>
): Promise<void> {
  const columns = UPDATABLE_COLUMNS.filter((column) => column in task);

  // Assigning every column unconditionally would overwrite the omitted ones
  // with NULL, which a partial update must not do.
  if (columns.length === 0) {
    return;
  }

  const db = await mysqlPersistence.getDatabase();
  const assignments = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => task[column] ?? null);

  await db
    .promise()
    .query(`UPDATE todo_items SET ${assignments} WHERE id = ?`, [
      ...values,
      id,
    ]);
}

export async function remove(id: string): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query('DELETE FROM todo_items WHERE id = ?', [id]);
}
