import { Router } from 'express';
import { body } from 'express-validator';
import { login, loginForm, logout, register, registerForm } from '../controllers/auth.controller.js';
import { read } from '../controllers/site.controller.js';

export const userRoutes = Router();

userRoutes.get('/', read);
userRoutes.get('/register', registerForm);
userRoutes.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('cfm_pwd')
      .notEmpty()
      .withMessage('Confirm Password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm Password must match Password');
        }
        return true;
      })
  ],
  register
);
userRoutes.get('/login', loginForm);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
