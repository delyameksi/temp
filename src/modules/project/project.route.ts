// project.route.ts

import { Router, Request, Response } from 'express';
import * as projectService from './project.service';

const router = Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crée un nouveau projet
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               description:
 *                 type: string
 *                 example: This is a sample project description.
 *     responses:
 *       201:
 *         description: Projet créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur lors de la création du projet
 */

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, userId, description } = req.body;

    const project = await projectService.createProject(
      name,
      userId,
      description
    );

    res.status(201).json(project);
  } catch (error) {
    console.error('Failed to create project:', error);

    res.status(500).json({
      error: 'Failed to create project',
    });
  }
});

/**
 * @swagger
 * /projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Récupère tous les projets
 *     responses:
 *       200:
 *         description: Liste des projets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Erreur lors de la récupération des projets
 */

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getProjects();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get projects',
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Récupère un projet par son identifiant
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du projet
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Projet trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet introuvable
 */

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectService.getProjectById(
      req.params.id.toString()
    );

    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({
      error: 'Project not found',
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Met à jour un projet
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du projet
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet introuvable
 */

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectService.updateProject(
      req.params.id.toString(),
      req.body
    );

    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({
      error: 'Project not found',
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Supprime un projet
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du projet
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Projet supprimé
 *       404:
 *         description: Projet introuvable
 *       500:
 *         description: Erreur lors de la suppression du projet
 */

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await projectService.deleteProject(req.params.id.toString());

    res.status(204).send();
  } catch (error) {
    res.status(404).json({
      error: 'Project not found',
    });
  }
});

export default router;
