// user.route.ts

import { Router, Request, Response } from 'express';
import * as userService from './user.service';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur lors de la récupération des utilisateurs
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get users',
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son identifiant
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id.toString());

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      error: 'User not found',
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Met à jour un utilisateur
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 */
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.updateUser(
      req.params.id.toString(),
      req.body
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      error: 'User not found',
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime un utilisateur
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id.toString());

    res.status(204).send();
  } catch (error) {
    res.status(404).json({
      error: 'User not found',
    });
  }
});

export default router;
