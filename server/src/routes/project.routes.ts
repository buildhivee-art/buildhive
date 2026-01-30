
import { Router, RequestHandler } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes (Optional: decide if guests can see projects. Let's allowing viewing)
router.get('/', getProjects as unknown as RequestHandler);
router.get('/:id', getProjectById as unknown as RequestHandler);

// Protected routes
router.post('/', authenticate as unknown as RequestHandler, createProject as unknown as RequestHandler);
router.patch('/:id', authenticate as unknown as RequestHandler, updateProject as unknown as RequestHandler);
router.delete('/:id', authenticate as unknown as RequestHandler, deleteProject as unknown as RequestHandler);

export default router;
