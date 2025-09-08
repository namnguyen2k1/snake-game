import { compare, genSalt, hash } from 'bcryptjs';
import * as userRepo from '../repositories/user.repository.js';

export async function registerUser({ name, email, password }) {
  const salt = await genSalt(10);
  const hashed = await hash(password, salt);
  return await userRepo.createUser({ name, email, password: hashed });
}

export async function findUserByEmail(email) {
  return await userRepo.getUserByEmail(email);
}

export async function findUserById(id) {
  return await userRepo.getUserById(id);
}

export async function validatePassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}
