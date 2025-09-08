import * as matchService from "../services/match.service.js";

export async function read(req, res) {
  res.send("match route");
}

export async function createMatch(req, res) {
  const match = await matchService.createMatch(req.body);
  res.status(201).send({ message: "Match saved successfully!", match });
}

export async function getMatchByAuthor(req, res) {
  const matches = await matchService.getMatchByUsername(req.body.name);
  console.log("match by", req.body, matches);
  if (!matches || matches.length === 0) {
    return res.status(404).send({ message: "No match found" });
  }
  res.send({ matches });
}

export async function getAllMatches(req, res) {
  const matches = await matchService.getAllMatches();
  console.log("matches", matches);
  if (!matches || matches.length === 0) {
    return res.status(404).send({ message: "No matches found" });
  }
  res.send({ matches });
}
