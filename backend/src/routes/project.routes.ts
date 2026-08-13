import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import * as projectValidator from '../validators/project.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Obtener proyectos (con filtros)
router.get(
  '/',
  projectValidator.projectFiltersValidator,
  validate,
  projectController.getProjects
);

// Obtener un proyecto por ID
router.get(
  '/:id',
  projectValidator.idParamValidator,
  validate,
  projectController.getProjectById
);

// Crear un proyecto
router.post(
  '/',
  projectValidator.createProjectValidator,
  validate,
  projectController.createProject
);

// Actualizar un proyecto
router.put(
  '/:id',
  projectValidator.updateProjectValidator,
  validate,
  projectController.updateProject
);

// Eliminar un proyecto
router.delete(
  '/:id',
  projectValidator.idParamValidator,
  validate,
  projectController.deleteProject
);

export default router;