import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/goals.json');

// Goals file structure — one object per user, keyed by userId:
// {
//   "userId-abc": { dailyCalories: "400", ... },
//   "userId-xyz": { dailyCalories: "300", ... }
// }

function readAllGoals(): Record<string, any> {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    // If old flat format (before isolation), start fresh
    const looksLikeOldFormat = raw.dailyCalories !== undefined;
    if (looksLikeOldFormat) return {};
    return raw;
  } catch {
    return {};
  }
}

function writeAllGoals(data: Record<string, any>) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class GoalsService {
  findAll(userId: string) {
    const all = readAllGoals();
    return all[userId] ?? {};
  }
 
  update(userId: string, body: any) {
    const all = readAllGoals();
    all[userId] = body;
    writeAllGoals(all);
    return body;
  }
}