import { randomUUID } from 'crypto';
import * as taskRepository from './task.repository';
import { TodoItem } from '../../types';

export async function getTasks(): Promise<TodoItem[]> {
  const tasks = await taskRepository.findAll();

  return tasks;
}

export async function getTaskById(id: string): Promise<TodoItem> {
  const task = await taskRepository.findById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
}

export async function getTasksByProject(
  projectId: string
): Promise<TodoItem[]> {
  const tasks = await taskRepository.findByProject(projectId);

  return tasks;
}

export async function createTask(
  projectId: string,
  name: string,
  description: string | undefined,
  deadline?: Date
): Promise<TodoItem> {
  const task: TodoItem = {
    id: randomUUID(),
    projectId,
    name,
    description,
    status: 'todo',
    deadline,
  };

  await taskRepository.create(task);

  // EVENT-DRIVEN: publish task.created event here

  return task;
}

export async function updateTask(
  id: string,
  data: Partial<TodoItem>
): Promise<TodoItem> {
  const existingTask = await taskRepository.findById(id);

  if (!existingTask) {
    throw new Error('Task not found');
  }

  await taskRepository.update(id, data);

  const updatedTask = await taskRepository.findById(id);

  if (!updatedTask) {
    throw new Error('Task not found');
  }

  // EVENT-DRIVEN: publish task.updated / task.moved event here

  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  const existingTask = await taskRepository.findById(id);

  if (!existingTask) {
    throw new Error('Task not found');
  }

  await taskRepository.remove(id);

  // EVENT-DRIVEN: publish task.deleted event here
}
