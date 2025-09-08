import { User } from '../models/user.model.js';

export async function createUser(newUser) {
  const user = new User(newUser);
  return await user.save();
}

export async function getUserByEmail(email) {
  return await User.findOne({ email }).exec();
}

export async function getUserById(id) {
  return await User.findById(id).exec();
}

export async function comparePassword(password, hash) {
  return await compare(password, hash);
}
