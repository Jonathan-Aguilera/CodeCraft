import { body, param, query } from 'express-validator';

// Validación para crear perfil
export const createDeveloperProfileValidator = [
  body('uid')
    .isString()
    .notEmpty()
    .withMessage('El UID del usuario es obligatorio'),
  body('title')
    .optional()
    .isString()
    .withMessage('El título debe ser texto')
    .trim()
    .escape(),
  body('bio')
    .optional()
    .isString()
    .withMessage('La biografía debe ser texto')
    .trim()
    .escape(),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Las habilidades deben ser un array de strings'),
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Cada habilidad debe ser texto'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los años de experiencia deben ser un número entero positivo'),
  body('hourlyRate')
    .optional()
    .isNumeric()
    .withMessage('La tarifa por hora debe ser un número')
    .custom(value => value >= 0)
    .withMessage('La tarifa por hora no puede ser negativa'),
  body('availability')
    .optional()
    .isIn(['available', 'busy', 'unavailable'])
    .withMessage('La disponibilidad debe ser "available", "busy" o "unavailable"'),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('Los enlaces sociales deben ser un objeto'),
  body('socialLinks.github')
    .optional()
    .isURL()
    .withMessage('El enlace de GitHub debe ser una URL válida'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('El enlace de LinkedIn debe ser una URL válida'),
  body('socialLinks.portfolio')
    .optional()
    .isURL()
    .withMessage('El enlace del portafolio debe ser una URL válida'),
  body('cvUrl')
    .optional()
    .isURL()
    .withMessage('La URL del CV debe ser una URL válida'),
];

// Validación para actualizar (todos los campos opcionales)
export const updateDeveloperProfileValidator = [
  param('uid')
    .isString()
    .notEmpty()
    .withMessage('El UID del usuario es obligatorio'),
  body('title')
    .optional()
    .isString()
    .withMessage('El título debe ser texto')
    .trim()
    .escape(),
  body('bio')
    .optional()
    .isString()
    .withMessage('La biografía debe ser texto')
    .trim()
    .escape(),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Las habilidades deben ser un array de strings'),
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Cada habilidad debe ser texto'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los años de experiencia deben ser un número entero positivo'),
  body('hourlyRate')
    .optional()
    .isNumeric()
    .withMessage('La tarifa por hora debe ser un número')
    .custom(value => value >= 0)
    .withMessage('La tarifa por hora no puede ser negativa'),
  body('availability')
    .optional()
    .isIn(['available', 'busy', 'unavailable'])
    .withMessage('La disponibilidad debe ser "available", "busy" o "unavailable"'),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('Los enlaces sociales deben ser un objeto'),
  body('socialLinks.github')
    .optional()
    .isURL()
    .withMessage('El enlace de GitHub debe ser una URL válida'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('El enlace de LinkedIn debe ser una URL válida'),
  body('socialLinks.portfolio')
    .optional()
    .isURL()
    .withMessage('El enlace del portafolio debe ser una URL válida'),
  body('cvUrl')
    .optional()
    .isURL()
    .withMessage('La URL del CV debe ser una URL válida'),
];

// Validación para UID en parámetros
export const uidParamValidator = [
  param('uid')
    .isString()
    .notEmpty()
    .withMessage('El UID del usuario es obligatorio'),
];

// Validación para filtros de consulta
export const profileFiltersValidator = [
  query('skills')
    .optional()
    .isString()
    .withMessage('Las habilidades deben ser una cadena separada por comas'),
  query('availability')
    .optional()
    .isIn(['available', 'busy', 'unavailable'])
    .withMessage('Disponibilidad inválida'),
  query('minRate')
    .optional()
    .isNumeric()
    .withMessage('La tarifa mínima debe ser un número'),
  query('maxRate')
    .optional()
    .isNumeric()
    .withMessage('La tarifa máxima debe ser un número'),
  query('minRating')
    .optional()
    .isNumeric()
    .withMessage('El rating mínimo debe ser un número'),
];