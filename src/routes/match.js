import { Router } from 'express';
import { createMatch, getAllMatches, getMatch, read } from '../controllers/match.controller.js';

export const matchRoutes = Router();

matchRoutes.get('/all', getAllMatches);
matchRoutes.post('/all', getMatch);
matchRoutes.get('/', read);
matchRoutes.post('/', createMatch);
