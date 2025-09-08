import { Router } from 'express';
import { body } from 'express-validator';
import { login, loginForm, logout, register, registerForm } from '../controllers/auth.controller.js';
import { read } from '../controllers/site.controller.js';

export function userRoutes() {
  const routes = Router();

  routes.get('/', read);
  routes.get('/register', registerForm);
  routes.post(
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
  routes.get('/login', loginForm);
  routes.post('/login', login);
  routes.get('/logout', logout);

  return routes;
}
