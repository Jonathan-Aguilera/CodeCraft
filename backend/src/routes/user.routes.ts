import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as userValidator from '../validators/user.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Rutas públicas (sin autenticación por ahora)
router.get(
  '/exists',
  userValidator.emailQueryValidator,
  validate,
  userController.checkUserExists
);

router.get(
  '/email',
  userValidator.emailQueryValidator,
  validate,
  userController.getUserByEmail
);

router.get(
  '/:uid',
  userValidator.uidParamValidator,
  validate,
  userController.getUserByUid
);

router.post(
  '/',
  userValidator.createUserValidator,
  validate,
  userController.createUser
);

router.put(
  '/:uid',
  userValidator.updateUserValidator,
  validate,
  userController.updateUser
);

router.delete(
  '/:uid',
  userValidator.uidParamValidator,
  validate,
  userController.deleteUser
);

export default router;