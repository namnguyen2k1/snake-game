import { MatchModel } from "../models/match.model.js";

export async function createMatch(data) {
  const match = new MatchModel(data);
  return await match.save();
}

export async function findMatchByAuthor(name) {
  return await MatchModel.find({ name }).exec();
}

export async function findAllMatches() {
  return await MatchModel.find().exec();
}
