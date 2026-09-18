import * as userRepository from '../user/user.repository';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  console.log('USER:', user);
  console.log('EMAIL:', email);
  // console.log('PASSWORD:', password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
  console.log('PASSWORD VALID:', isValidPassword);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  console.log('JWT_SECRET existe :', !!process.env.JWT_SECRET);
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function register(name: string, email: string, password: string) {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error('Email already used');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userService.createUser(name, email, hashedPassword);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
