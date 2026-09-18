import { beforeEach, describe, expect, it, vi } from 'vitest';
import type mysql from 'mysql2';
import { mysqlPersistence } from '../../persistence/mysql';
import { update } from './project.repository';

vi.mock('../../persistence/mysql', () => ({
  mysqlPersistence: { getDatabase: vi.fn() },
}));

const query = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  query.mockResolvedValue([[], []]);
  vi.mocked(mysqlPersistence.getDatabase).mockResolvedValue({
    promise: () => ({ query }),
  } as unknown as mysql.Pool);
});

describe('update', () => {
  it('assigns only the columns that were provided', async () => {
    await update('project-1', { name: 'Renamed' });

    expect(query).toHaveBeenCalledWith(
      'UPDATE todo_projects SET name = ? WHERE id = ?',
      ['Renamed', 'project-1']
    );
  });

  it('assigns every provided column, in whitelist order', async () => {
    await update('project-1', { name: 'Renamed', description: 'Why not' });

    expect(query).toHaveBeenCalledWith(
      'UPDATE todo_projects SET name = ?, description = ? WHERE id = ?',
      ['Renamed', 'Why not', 'project-1']
    );
  });

  it('ignores keys outside the whitelist, including the primary key', async () => {
    await update('project-1', { id: 'smuggled', name: 'Renamed' });

    expect(query).toHaveBeenCalledWith(
      'UPDATE todo_projects SET name = ? WHERE id = ?',
      ['Renamed', 'project-1']
    );
  });

  it('stores an explicit undefined as NULL', async () => {
    await update('project-1', { description: undefined });

    expect(query).toHaveBeenCalledWith(
      'UPDATE todo_projects SET description = ? WHERE id = ?',
      [null, 'project-1']
    );
  });

  it('does not reach the database when nothing is updatable', async () => {
    await update('project-1', {});

    expect(mysqlPersistence.getDatabase).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
  });
});
