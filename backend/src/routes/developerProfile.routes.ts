import { Router } from 'express';
import * as developerProfileController from '../controllers/developerProfile.controller';
import * as developerProfileValidator from '../validators/developerProfile.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Obtener todos los perfiles (con filtros)
router.get(
  '/',
  developerProfileValidator.profileFiltersValidator,
  validate,
  developerProfileController.getDeveloperProfiles
);

// Obtener un perfil por UID
router.get(
  '/:uid',
  developerProfileValidator.uidParamValidator,
  validate,
  developerProfileController.getProfileByUid
);

// Crear un perfil
router.post(
  '/',
  developerProfileValidator.createDeveloperProfileValidator,
  validate,
  developerProfileController.createDeveloperProfile
);

// Actualizar un perfil
router.put(
  '/:uid',
  developerProfileValidator.updateDeveloperProfileValidator,
  validate,
  developerProfileController.updateDeveloperProfile
);

// Eliminar un perfil
router.delete(
  '/:uid',
  developerProfileValidator.uidParamValidator,
  validate,
  developerProfileController.deleteDeveloperProfile
);

export default router;