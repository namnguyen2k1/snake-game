import * as matchService from '../services/match.service.js';

export async function read(req, res) {
  res.send('match route');
}

export async function createMatch(req, res) {
  try {
    const match = await matchService.createMatchService(req.body);
    res.status(201).send({ message: 'Match saved successfully!', match });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to save match' });
  }
}

export async function getMatch(req, res) {
  try {
    const matches = await matchService.getMatchByAuthorService(req.body.name);
    if (!matches || matches.length === 0) {
      return res.status(404).send({ message: 'No match found' });
    }
    res.send({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching matches' });
  }
}

export async function getAllMatches(req, res) {
  try {
    const matches = await matchService.getAllMatchesService();
    if (!matches || matches.length === 0) {
      return res.status(404).send({ message: 'No matches found' });
    }
    res.send({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching all matches' });
  }
}
