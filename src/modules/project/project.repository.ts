import { mysqlPersistence } from '../../persistence/mysql';
import { TodoProject } from '../../types';

// Whitelist of columns an update is allowed to touch. Column names cannot be
// bound as query parameters, so the SET clause is built from this list only.
const UPDATABLE_COLUMNS = ['name', 'description', 'owner_id'] as const;

export async function findAll(): Promise<TodoProject[]> {
  const db = await mysqlPersistence.getDatabase();
  const [rows] = await db.promise().query('SELECT * FROM todo_projects');

  return rows as TodoProject[];
}

export async function findById(id: string): Promise<TodoProject | undefined> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_projects WHERE id = ?', [id]);

  const projects = rows as TodoProject[];

  return projects[0];
}

export async function findByOwnerId(ownerId: string): Promise<TodoProject[]> {
  const db = await mysqlPersistence.getDatabase();

  const [rows] = await db
    .promise()
    .query('SELECT * FROM todo_projects WHERE owner_id = ?', [ownerId]);

  return rows as TodoProject[];
}

export async function create(project: TodoProject): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query(
    `INSERT INTO todo_projects
     (id, name, description, owner_id)
     VALUES (?, ?, ?, ?)`,
    [project.id, project.name, project.description ?? null, project.owner_id]
  );
}

export async function update(
  id: string,
  project: Partial<TodoProject>
): Promise<void> {
  const columns = UPDATABLE_COLUMNS.filter((column) => column in project);

  // Assigning every column unconditionally would overwrite the omitted ones
  // with NULL, which a partial update must not do.
  if (columns.length === 0) {
    return;
  }

  const db = await mysqlPersistence.getDatabase();
  const assignments = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => project[column] ?? null);

  await db
    .promise()
    .query(`UPDATE todo_projects SET ${assignments} WHERE id = ?`, [
      ...values,
      id,
    ]);
}

export async function remove(id: string): Promise<void> {
  const db = await mysqlPersistence.getDatabase();

  await db.promise().query('DELETE FROM todo_projects WHERE id = ?', [id]);
}
