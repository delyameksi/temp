import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as taskRepository from './task.repository';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByProject,
  updateTask,
} from './task.service';
import { TodoItem } from '../../types';

vi.mock('./task.repository');

const TASK: TodoItem = {
  id: 'task-1',
  projectId: 'project-1',
  name: 'Write the tests',
  status: 'todo',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('createTask', () => {
  it('starts a new task in the todo status', async () => {
    const created = await createTask('project-1', 'Write the tests', undefined);

    expect(created.status).toBe('todo');
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(taskRepository.create).toHaveBeenCalledWith(created);
  });

  it('carries the optional description and deadline through', async () => {
    const deadline = new Date('2026-01-01T00:00:00Z');

    const created = await createTask(
      'project-1',
      'Ship',
      'with care',
      deadline
    );

    expect(created).toMatchObject({
      projectId: 'project-1',
      description: 'with care',
      deadline,
    });
  });
});

describe('getTaskById', () => {
  it('throws when the task is missing', async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(undefined);

    await expect(getTaskById('unknown')).rejects.toThrow();
  });
});

describe('getTasksByProject', () => {
  it('asks the repository for that project only', async () => {
    vi.mocked(taskRepository.findByProject).mockResolvedValue([TASK]);

    await expect(getTasksByProject('project-1')).resolves.toEqual([TASK]);
    expect(taskRepository.findByProject).toHaveBeenCalledWith('project-1');
  });
});

describe('updateTask', () => {
  it('returns the task as re-read after the update', async () => {
    const updated: TodoItem = { ...TASK, status: 'done' };
    vi.mocked(taskRepository.findById)
      .mockResolvedValueOnce(TASK)
      .mockResolvedValueOnce(updated);

    await expect(updateTask('task-1', { status: 'done' })).resolves.toEqual(
      updated
    );
  });

  it('does not update a task that does not exist', async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(undefined);

    await expect(updateTask('unknown', { status: 'done' })).rejects.toThrow(
      'Task not found'
    );
    expect(taskRepository.update).not.toHaveBeenCalled();
  });
});

describe('deleteTask', () => {
  it('does not remove anything when the task is missing', async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(undefined);

    await expect(deleteTask('unknown')).rejects.toThrow('Task not found');
    expect(taskRepository.remove).not.toHaveBeenCalled();
  });
});
