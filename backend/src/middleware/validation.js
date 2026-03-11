const { body, validationResult } = require('express-validator');

// Validation middleware handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Transaction validation rules
const transactionValidation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required (ISO format)'),
  body('description').optional().isString().trim(),
  validate
];

// Budget validation rules
const budgetValidation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('limit_amount').isFloat({ min: 0 }).withMessage('Limit must be a positive number'),
  body('spent').optional().isFloat({ min: 0 }).withMessage('Spent must be a positive number'),
  validate
];

// User validation rules
const userValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  validate
];

// Chat message validation
const chatValidation = [
  body('message').isString().trim().notEmpty().withMessage('Message is required'),
  body('user_id').optional().isInt({ min: 1 }),
  validate
];

module.exports = {
  validate,
  transactionValidation,
  budgetValidation,
  userValidation,
  loginValidation,
  chatValidation
};
