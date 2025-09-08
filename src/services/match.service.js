import * as matchRepo from '../repositories/match.repository.js';

export async function createMatchService({ author, date, score, time }) {
  return await matchRepo.createMatch({ author, date, score, time });
}

export async function getMatchByAuthorService(author) {
  return await matchRepo.findMatchByAuthor(author);
}

export async function getAllMatchesService() {
  return await matchRepo.findAllMatches();
}
