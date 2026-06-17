import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name required'),
  body('sku').trim().notEmpty().withMessage('SKU required'),
  body('category').notEmpty().withMessage('Category required'),
  body('shortDescription').notEmpty().withMessage('Short description required'),
  body('longDescription').notEmpty().withMessage('Long description required'),
];

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('leadSource').notEmpty().withMessage('Lead source required'),
];

export const rfqValidation = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('companyName').notEmpty(),
  body('product').notEmpty(),
  body('quantity').isInt({ min: 1 }),
];

export const blogValidation = [
  body('title').notEmpty(),
  body('content').notEmpty(),
];
