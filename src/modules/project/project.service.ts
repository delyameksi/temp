import { randomUUID } from 'crypto';
import * as projectRepository from './project.repository';
import { TodoProject } from '../../types';

export async function getProjects(): Promise<TodoProject[]> {
  const projects = await projectRepository.findAll();

  return projects;
}

export async function getProjectById(id: string): Promise<TodoProject> {
  const project = await projectRepository.findById(id);

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
}

export async function getProjectsByOwner(
  ownerId: string
): Promise<TodoProject[]> {
  const projects = await projectRepository.findByOwnerId(ownerId);

  return projects;
}

export async function createProject(
  name: string,
  owner_id: string,
  description?: string
): Promise<TodoProject> {
  const project: TodoProject = {
    id: randomUUID(),
    name,
    owner_id,
    description,
  };

  await projectRepository.create(project);

  // EVENT-DRIVEN: publish project.created event here

  return project;
}

export async function updateProject(
  id: string,
  data: Partial<TodoProject>
): Promise<TodoProject> {
  const existingProject = await projectRepository.findById(id);

  if (!existingProject) {
    throw new Error('Project not found');
  }

  await projectRepository.update(id, data);

  const updatedProject = await projectRepository.findById(id);

  if (!updatedProject) {
    throw new Error('Project not found');
  }

  // EVENT-DRIVEN: publish project.updated event here

  return updatedProject;
}

export async function deleteProject(id: string): Promise<void> {
  const existingProject = await projectRepository.findById(id);

  if (!existingProject) {
    throw new Error('Project not found');
  }

  await projectRepository.remove(id);

  // EVENT-DRIVEN: publish project.deleted event here
}
