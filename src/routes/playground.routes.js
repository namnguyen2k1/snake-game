import { Router } from 'express';

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/users/login');
  }
}
export function playgroundRoutes() {
  const siteRoutes = Router();

  siteRoutes.get('/', isLoggedIn, function (req, res) {
    console.log('login success', res.locals.user);
    res.render('pages/index', {
      user: res.locals.user
    });
  });

  return siteRoutes;
}
