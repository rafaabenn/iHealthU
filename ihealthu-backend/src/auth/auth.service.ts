import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

const DB_PATH = path.join(__dirname, '../../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-secret-in-production';

function readUsers() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeUsers(users: any[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function stripPassword(user: any) {
  const { password, ...safe } = user;
  return safe;
}

function signToken(user: any): string {
  return jwt.sign(
    { id: user.id, email: user.email },  // payload stored inside the token
    JWT_SECRET,
    { expiresIn: '7d' },                 // token expires after 7 days
  );
}

@Injectable()
export class AuthService {
  register(name: string, email: string, password: string) {
    const users = readUsers();
    const exists = users.find((u: any) => u.email === email);
    if (exists) throw new UnauthorizedException('Email already used');

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    writeUsers(users);

    const token = signToken(newUser);
    return { message: 'User registered', token, user: stripPassword(newUser) };
  }

  login(email: string, password: string) {
    const users = readUsers();
    const user = users.find(
      (u: any) => u.email === email && u.password === password,
    );
    if (!user) throw new UnauthorizedException('Bad credentials');

    const token = signToken(user);
    return { message: 'Login successful', token, user: stripPassword(user) };
  }
}