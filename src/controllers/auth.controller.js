import { validationResult } from 'express-validator';
import passport from 'passport';
import { User } from '../models/user.model.js';
import { registerUser } from '../services/user.service.js';

export function loginForm(req, res) {
  res.render('pages/login');
}

export function login(req, res, next) {
  console.log('login auth controller');
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, () => {
    console.log('login passport authenticate', req.user);
    req.flash('success_message', 'You are now Logged in!!');
    res.redirect('/');
  });
}

export function registerForm(req, res) {
  res.render('pages/register');
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('pages/register', { errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const user = new User({
      name,
      email,
      password
    });

    console.log('auth controller', user);

    await registerUser(user);

    req.flash('success_message', 'You have registered, now please login');
    res.redirect('login');
  } catch (err) {
    console.error(err);
    req.flash('error_message', 'Registration failed');
    res.redirect('register');
  }
}

export function logout(req, res, next) {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    console.log('logout');
    req.flash('success_message', 'You are logged out');
    res.redirect('/users/login');
  });
}
