import { body, query, param } from 'express-validator';

// Validaciones para creación de usuario
export const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('displayName')
    .optional()
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .escape(),
  body('photoURL')
    .optional()
    .isURL()
    .withMessage('La URL de la foto debe ser válida'),
  body('role')
    .isIn(['developer', 'client', 'both'])
    .withMessage('Rol inválido. Solo se permiten: developer, client o both'),
];

// Validaciones para actualización (todos los campos opcionales)
export const updateUserValidator = [
  param('uid')
    .isString()
    .notEmpty()
    .withMessage('UID es requerido'),
  body('displayName')
    .optional()
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .escape(),
  body('photoURL')
    .optional()
    .isURL()
    .withMessage('La URL de la foto debe ser válida'),
  body('role')
    .optional()
    .isIn(['developer', 'client', 'both'])
    .withMessage('Rol inválido. Solo se permiten: developer, client o both'),
];

// Validación para consultas por email
export const emailQueryValidator = [
  query('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
];

// Validación para UID en parámetros de ruta
export const uidParamValidator = [
  param('uid')
    .isString()
    .notEmpty()
    .withMessage('UID es requerido'),
];