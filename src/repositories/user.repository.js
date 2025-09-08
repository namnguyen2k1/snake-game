import { UserModel } from '../models/user.model.js';

export async function createUser(payload) {
  const user = new UserModel(payload);
  return await user.save();
}

export async function getUserByEmail(email) {
  return await UserModel.findOne({ email }).exec();
}

export async function getUserById(id) {
  return await UserModel.findById(id).exec();
}

export async function comparePassword(password, hash) {
  return await compare(password, hash);
}
