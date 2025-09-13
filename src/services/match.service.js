import * as matchRepo from "../repositories/match.repository.js";

export async function createMatch({ name, date, score, time }) {
  return await matchRepo.createMatch({ name, date, score, time });
}

export async function getMatchByUsername(name) {
  return await matchRepo.findMatchByAuthor(name);
}

export async function getAllMatches() {
  return await matchRepo.findAllMatches();
}
