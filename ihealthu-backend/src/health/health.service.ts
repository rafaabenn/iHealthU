import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/health.json');

function readLogs() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeLogs(data: any[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class HealthService {
  findAll(userId: string) {
    const logs = readLogs();
    return logs.filter((l: any) => l.userId === userId);
  }

  create(userId: string, body: any) {
    const logs = readLogs();
    const newLog = { id: Date.now().toString(), userId, ...body };
    logs.unshift(newLog);
    writeLogs(logs);
    return newLog;
  }

  remove(userId: string, id: string) {
    const logs = readLogs();
    const filtered = logs.filter(
        (l: any) => !(l.id === id && l.userId === userId));
    if (filtered.length === logs.length) throw new NotFoundException('Entry not found');
    writeLogs(filtered);
    return { message: 'Deleted' };
  }
}