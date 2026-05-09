import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/daily.json');

// Structure du fichier :
// { "userId_2026-05-09": { water: 5, sleep: 7.5, date: "2026-05-09", userId: "..." } }

function readAll(): Record<string, any> {
  if (!fs.existsSync(DB_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return {}; }
}

function writeAll(data: Record<string, any>) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function todayKey(userId: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${userId}_${date}`;
}

@Injectable()
export class DailyService {
  getToday(userId: string) {
    const all = readAll();
    const key = todayKey(userId);
    return all[key] ?? { water: 0, sleep: 0, date: new Date().toISOString().split('T')[0] };
  }

  update(userId: string, body: { water?: number; sleep?: number }) {
    const all = readAll();
    const key = todayKey(userId);
    const existing = all[key] ?? { water: 0, sleep: 0 };
    all[key] = {
      ...existing,
      ...body,
      userId,
      date: new Date().toISOString().split('T')[0],
    };
    writeAll(all);
    return all[key];
  }

  // Utilisé par StreakService — lit n'importe quelle date
  getByDate(userId: string, date: string) {
    const all = readAll();
    const key = `${userId}_${date}`;
    return all[key] ?? { water: 0, sleep: 0 };
  }
}