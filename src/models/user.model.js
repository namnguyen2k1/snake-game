import { Schema, model } from 'mongoose';
import { DB_COLLECTION } from '../config/database.js';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model(DB_COLLECTION.USER, UserSchema);
