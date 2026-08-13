import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import * as applicationValidator from '../validators/application.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Obtener aplicaciones de un proyecto
router.get(
  '/project/:projectId',
  applicationValidator.projectIdParamValidator,
  validate,
  applicationController.getApplicationsByProject
);

// Obtener aplicaciones de un desarrollador
router.get(
  '/developer/:developerUid',
  applicationValidator.developerUidParamValidator,
  validate,
  applicationController.getApplicationsByDeveloper
);

// Obtener una aplicación por ID
router.get(
  '/:id',
  applicationValidator.idParamValidator,
  validate,
  applicationController.getApplicationById
);

// Crear una postulación
router.post(
  '/',
  applicationValidator.createApplicationValidator,
  validate,
  applicationController.createApplication
);

// Actualizar estado de una postulación
router.put(
  '/:id/status',
  applicationValidator.updateApplicationStatusValidator,
  validate,
  applicationController.updateApplicationStatus
);

// Eliminar una postulación
router.delete(
  '/:id',
  applicationValidator.idParamValidator,
  validate,
  applicationController.deleteApplication
);

export default router;