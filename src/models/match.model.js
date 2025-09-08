import { Schema, model } from 'mongoose';

const MatchSchema = new Schema(
  {
    author: { type: String, required: true },
    date: { type: String, required: true },
    score: { type: Number, required: true },
    time: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const Match = model('matches', MatchSchema);
