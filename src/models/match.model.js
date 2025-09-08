import { Schema, model } from 'mongoose';
import { DB_COLLECTION } from '../config/database.js';

const MatchSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    score: { type: Number, required: true },
    time: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const MatchModel = model(DB_COLLECTION.MATCH, MatchSchema);
