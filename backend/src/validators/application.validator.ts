import { body, param } from 'express-validator';

// Validación para crear una postulación
export const createApplicationValidator = [
  body('projectId')
    .isString()
    .notEmpty()
    .withMessage('El ID del proyecto es obligatorio'),
  body('developerUid')
    .isString()
    .notEmpty()
    .withMessage('El UID del desarrollador es obligatorio'),
  body('developerName')
    .isString()
    .notEmpty()
    .withMessage('El nombre del desarrollador es obligatorio'),
  body('proposedRate')
    .isNumeric()
    .withMessage('La tarifa propuesta debe ser un número')
    .custom(value => value > 0)
    .withMessage('La tarifa propuesta debe ser mayor a 0'),
  body('coverLetter')
    .optional()
    .isString()
    .withMessage('La carta de presentación debe ser texto')
    .trim()
    .escape(),
  body('answers')
    .optional()
    .isArray()
    .withMessage('Las respuestas deben ser un array de strings'),
  body('answers.*')
    .optional()
    .isString()
    .withMessage('Cada respuesta debe ser texto'),
];

// Validación para actualizar estado
export const updateApplicationStatusValidator = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('El ID de la aplicación es obligatorio'),
  body('status')
    .isIn(['accepted', 'rejected'])
    .withMessage('El estado debe ser "accepted" o "rejected"'),
  body('clientUid')
    .isString()
    .notEmpty()
    .withMessage('El UID del cliente es obligatorio'),
];

// Validación para ID en parámetros
export const idParamValidator = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('El ID es obligatorio'),
];

// Validación para projectId en parámetros
export const projectIdParamValidator = [
  param('projectId')
    .isString()
    .notEmpty()
    .withMessage('El ID del proyecto es obligatorio'),
];

// Validación para developerUid en parámetros
export const developerUidParamValidator = [
  param('developerUid')
    .isString()
    .notEmpty()
    .withMessage('El UID del desarrollador es obligatorio'),
];