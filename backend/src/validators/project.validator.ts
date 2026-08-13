import { body, param, query } from 'express-validator';

// Validación para crear proyecto
export const createProjectValidator = [
  body('clientUid')
    .isString()
    .notEmpty()
    .withMessage('El UID del cliente es obligatorio'),
  body('clientName')
    .isString()
    .notEmpty()
    .withMessage('El nombre del cliente es obligatorio'),
  body('title')
    .isString()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .trim()
    .escape(),
  body('description')
    .isString()
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .trim()
    .escape(),
  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('Las habilidades deben ser un array de strings'),
  body('requiredSkills.*')
    .optional()
    .isString()
    .withMessage('Cada habilidad debe ser texto'),
  body('budgetMin')
    .isNumeric()
    .withMessage('El presupuesto mínimo debe ser un número')
    .custom(value => value > 0)
    .withMessage('El presupuesto mínimo debe ser mayor a 0'),
  body('budgetMax')
    .isNumeric()
    .withMessage('El presupuesto máximo debe ser un número')
    .custom(value => value > 0)
    .withMessage('El presupuesto máximo debe ser mayor a 0'),
  body('paymentType')
    .isIn(['hourly', 'fixed'])
    .withMessage('El tipo de pago debe ser "hourly" o "fixed"'),
  body('maxDevelopersNeeded')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de desarrolladores debe ser al menos 1'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Estado inválido'),
  body('recommendedRoles')
    .optional()
    .isArray()
    .withMessage('Los roles recomendados deben ser un array de strings'),
  body('recommendedRoles.*')
    .optional()
    .isString()
    .withMessage('Cada rol recomendado debe ser texto'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe tener formato ISO 8601'),
];

// Validación para actualizar (todos los campos opcionales)
export const updateProjectValidator = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('El ID del proyecto es obligatorio'),
  body('title')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .trim()
    .escape(),
  body('description')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía')
    .trim()
    .escape(),
  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('Las habilidades deben ser un array de strings'),
  body('requiredSkills.*')
    .optional()
    .isString()
    .withMessage('Cada habilidad debe ser texto'),
  body('budgetMin')
    .optional()
    .isNumeric()
    .withMessage('El presupuesto mínimo debe ser un número')
    .custom(value => value > 0)
    .withMessage('El presupuesto mínimo debe ser mayor a 0'),
  body('budgetMax')
    .optional()
    .isNumeric()
    .withMessage('El presupuesto máximo debe ser un número')
    .custom(value => value > 0)
    .withMessage('El presupuesto máximo debe ser mayor a 0'),
  body('paymentType')
    .optional()
    .isIn(['hourly', 'fixed'])
    .withMessage('El tipo de pago debe ser "hourly" o "fixed"'),
  body('maxDevelopersNeeded')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El número de desarrolladores debe ser al menos 1'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Estado inválido'),
  body('recommendedRoles')
    .optional()
    .isArray()
    .withMessage('Los roles recomendados deben ser un array de strings'),
  body('recommendedRoles.*')
    .optional()
    .isString()
    .withMessage('Cada rol recomendado debe ser texto'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe tener formato ISO 8601'),
];

// Validación para ID en parámetros
export const idParamValidator = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('El ID del proyecto es obligatorio'),
];

// Validación para filtros de consulta (GET /projects)
export const projectFiltersValidator = [
  query('status')
    .optional()
    .isIn(['open', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Estado inválido'),
  query('skills')
    .optional()
    .isString()
    .withMessage('Las habilidades deben ser una cadena separada por comas'),
  query('minBudget')
    .optional()
    .isNumeric()
    .withMessage('El presupuesto mínimo debe ser un número'),
  query('maxBudget')
    .optional()
    .isNumeric()
    .withMessage('El presupuesto máximo debe ser un número'),
];