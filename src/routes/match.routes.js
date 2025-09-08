import { Router } from 'express';
import * as matchController from '../controllers/match.controller.js';

export function matchRoutes() {
  const router = Router();

  router.get('/all', matchController.getAllMatches);
  router.post('/all', matchController.getMatchByAuthor);
  router.get('/', matchController.read);
  router.post('/', matchController.createMatch);

  return router;
}
