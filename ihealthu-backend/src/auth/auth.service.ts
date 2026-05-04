import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/users.json');

function readUsers() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeUsers(users: any[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

@Injectable()
export class AuthService {
  register(email: string, password: string) {
    const users = readUsers();
    const exists = users.find((u: any) => u.email === email);
    if (exists) throw new UnauthorizedException('Email already used');
    const newUser = { id: Date.now().toString(), email, password };
    users.push(newUser);
    writeUsers(users);
    return { message: 'User registered', user: newUser };
  }

  login(email: string, password: string) {
    const users = readUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) throw new UnauthorizedException('Bad credentials');
    return { message: 'Login successful', user };
  }
}