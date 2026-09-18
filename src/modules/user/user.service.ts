import { randomUUID } from 'crypto';
import * as userRepository from './user.repository';
import { TodoUser } from '../../types';

export async function getUsers(): Promise<TodoUser[]> {
  const users = await userRepository.findAll();

  return users;
}

export async function getUserById(id: string): Promise<TodoUser> {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
): Promise<TodoUser> {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error('Email already used');
  }

  const user: TodoUser = {
    id: randomUUID(),
    name,
    email,
    hashedPassword,
  };

  await userRepository.create(user);

  return user;
}

export async function updateUser(
  id: string,
  data: Partial<TodoUser>
): Promise<TodoUser> {
  const existingUser = await userRepository.findById(id);

  if (!existingUser) {
    throw new Error('User not found');
  }

  await userRepository.update(id, data);

  const updatedUser = await userRepository.findById(id);

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const existingUser = await userRepository.findById(id);

  if (!existingUser) {
    throw new Error('User not found');
  }

  await userRepository.remove(id);
}
