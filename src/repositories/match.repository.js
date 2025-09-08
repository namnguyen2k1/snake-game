import { Match } from '../models/match.model.js';

export async function createMatch(data) {
  const match = new Match(data);
  return await match.save();
}

export async function findMatchByAuthor(author) {
  return await Match.find({ author }).exec();
}

export async function findAllMatches() {
  return await Match.find().exec();
}
