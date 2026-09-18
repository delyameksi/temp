import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as projectRepository from './project.repository';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from './project.service';
import { TodoProject } from '../../types';

// The service only orchestrates: mocking the repository keeps these tests away
// from MySQL entirely.
vi.mock('./project.repository');

const PROJECT: TodoProject = {
  id: 'project-1',
  name: 'Legacy',
  owner_id: 'user-1',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getProjects', () => {
  it('returns what the repository holds', async () => {
    vi.mocked(projectRepository.findAll).mockResolvedValue([PROJECT]);

    await expect(getProjects()).resolves.toEqual([PROJECT]);
  });
});

describe('getProjectById', () => {
  it('returns the project when it exists', async () => {
    vi.mocked(projectRepository.findById).mockResolvedValue(PROJECT);

    await expect(getProjectById('project-1')).resolves.toEqual(PROJECT);
  });

  it('throws when the project is missing', async () => {
    vi.mocked(projectRepository.findById).mockResolvedValue(undefined);

    await expect(getProjectById('unknown')).rejects.toThrow(
      'Project not found'
    );
  });
});

describe('createProject', () => {
  it('persists the project it returns, with a generated id', async () => {
    const created = await createProject('Legacy', 'user-1');

    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created).toMatchObject({ name: 'Legacy', owner_id: 'user-1' });
    expect(projectRepository.create).toHaveBeenCalledWith(created);
  });
});

describe('updateProject', () => {
  it('returns the project as re-read after the update', async () => {
    const updated = { ...PROJECT, name: 'Renamed' };
    vi.mocked(projectRepository.findById)
      .mockResolvedValueOnce(PROJECT)
      .mockResolvedValueOnce(updated);

    await expect(
      updateProject('project-1', { name: 'Renamed' })
    ).resolves.toEqual(updated);
    expect(projectRepository.update).toHaveBeenCalledWith('project-1', {
      name: 'Renamed',
    });
  });

  it('does not update a project that does not exist', async () => {
    vi.mocked(projectRepository.findById).mockResolvedValue(undefined);

    await expect(updateProject('unknown', { name: 'x' })).rejects.toThrow(
      'Project not found'
    );
    expect(projectRepository.update).not.toHaveBeenCalled();
  });
});

describe('deleteProject', () => {
  it('removes an existing project', async () => {
    vi.mocked(projectRepository.findById).mockResolvedValue(PROJECT);

    await deleteProject('project-1');

    expect(projectRepository.remove).toHaveBeenCalledWith('project-1');
  });

  it('does not remove anything when the project is missing', async () => {
    vi.mocked(projectRepository.findById).mockResolvedValue(undefined);

    await expect(deleteProject('unknown')).rejects.toThrow('Project not found');
    expect(projectRepository.remove).not.toHaveBeenCalled();
  });
});
