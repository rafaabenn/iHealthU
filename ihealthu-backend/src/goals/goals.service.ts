import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/goals.json');

function readGoals() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeGoals(data: any) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class GoalsService {
  findAll() {
    return readGoals();
  }

  update(body: any) {
    writeGoals(body);
    return body;
  }
}