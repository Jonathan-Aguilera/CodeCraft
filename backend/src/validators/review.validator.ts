import { body, param, query } from 'express-validator';

// Validación para crear reseña
export const createReviewValidator = [
  body('targetUid').isString().notEmpty().withMessage('targetUid es obligatorio'),
  body('userUid').isString().notEmpty().withMessage('userUid es obligatorio'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating debe ser entre 1 y 5'),
  body('projectId').optional().isString().withMessage('projectId debe ser texto'),
  body('comment').optional().isString().trim().escape().withMessage('comment debe ser texto'),
];

// Validación para actualizar
export const updateReviewValidator = [
  param('id').isString().notEmpty().withMessage('ID de reseña requerido'),
  body('userUid').isString().notEmpty().withMessage('userUid requerido'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating debe ser entre 1 y 5'),
  body('comment').optional().isString().trim().escape(),
];

// Validación para eliminar
export const deleteReviewValidator = [
  param('id').isString().notEmpty().withMessage('ID de reseña requerido'),
  body('requesterUid').isString().notEmpty().withMessage('requesterUid requerido'),
  body('isAdmin').optional().isBoolean().withMessage('isAdmin debe ser booleano'),
];

// Validación para reportar
export const reportReviewValidator = [
  param('id').isString().notEmpty().withMessage('ID de reseña requerido'),
  body('reporterUid').isString().notEmpty().withMessage('reporterUid requerido'),
];

// Validación para consultas
export const authorQueryValidator = [
  param('userUid').isString().notEmpty().withMessage('userUid requerido'),
  query('requesterUid').optional().isString(),
  query('isAdmin').optional().isBoolean(),
];

export const targetQueryValidator = [
  param('targetUid').isString().notEmpty().withMessage('targetUid requerido'),
  query('requesterUid').optional().isString(),
  query('isAdmin').optional().isBoolean(),
];

export const projectQueryValidator = [
  param('projectId').isString().notEmpty().withMessage('projectId requerido'),
];

export const idParamValidator = [
  param('id').isString().notEmpty().withMessage('ID requerido'),
];

export const reportedQueryValidator = [
  query('isAdmin').isString().notEmpty().withMessage('isAdmin requerido'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit debe ser entero positivo'),
];

export const ratingQueryValidator = [
  param('targetUid').isString().notEmpty().withMessage('targetUid requerido'),
];