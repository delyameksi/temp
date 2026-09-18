import { Router, Request, Response } from 'express';
import * as taskService from './task.service';

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Récupère toutes les tâches
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erreur lors de la récupération des tâches
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await taskService.getTasks();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get tasks',
    });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Récupère une tâche par son identifiant
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de la tâche
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche introuvable
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.id.toString());

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: 'Task not found',
    });
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crée une nouvelle tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - name
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *                 example: Implement login page
 *               description:
 *                 type: string
 *                 example: Create the login form and connect it to the API
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-30T18:00:00
 *     responses:
 *       201:
 *         description: Tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Erreur lors de la création de la tâche
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, name, description, deadline } = req.body;

    const task = await taskService.createTask(
      projectId,
      name,
      description,
      deadline ? new Date(deadline) : undefined
    );

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create task',
    });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Met à jour une tâche
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de la tâche
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - todo
 *                   - in_progress
 *                   - done
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche introuvable
 */
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskService.updateTask(
      req.params.id.toString(),
      req.body
    );

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: 'Task not found',
    });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Supprime une tâche
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de la tâche
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Tâche supprimée
 *       404:
 *         description: Tâche introuvable
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.id.toString());

    res.status(204).send();
  } catch (error) {
    res.status(404).json({
      error: 'Task not found',
    });
  }
});

export default router;
