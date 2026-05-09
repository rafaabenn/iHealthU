import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const MOOD_LOGS_PATH = path.join(__dirname, '../../data/mood_logs.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

@Injectable()
export class MoodService {
  getLogs(userId: string) {
    const allLogs = readJSON(MOOD_LOGS_PATH) ?? {};
    return allLogs[userId] ?? {};
  }

  updateMood(userId: string, data: { date: string; mood: string; note: string }) {
    const allLogs = readJSON(MOOD_LOGS_PATH) ?? {};
    if (!allLogs[userId]) allLogs[userId] = {};
    
    // Store by date to ensure only one mood per day
    allLogs[userId][data.date] = {
      mood: data.mood,
      note: data.note,
      updatedAt: new Date().toISOString()
    };
    
    writeJSON(MOOD_LOGS_PATH, allLogs);
    return allLogs[userId][data.date];
  }

  getToday(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getLogs(userId);
    return logs[today] || null;
  }
}
