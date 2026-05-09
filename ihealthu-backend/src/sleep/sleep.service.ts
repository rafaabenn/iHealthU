import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const SLEEP_LOGS_PATH = path.join(__dirname, '../../data/sleep_logs.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

@Injectable()
export class SleepService {
  getLogs(userId: string) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    return allLogs[userId] ?? [];
  }

  addLog(userId: string, data: { date: string; startTime: string; endTime: string; duration: number }) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    if (!allLogs[userId]) allLogs[userId] = [];
    
    // Add new log at the beginning
    allLogs[userId].unshift({
      id: Date.now().toString(),
      ...data
    });
    
    // Keep only last 30 logs
    if (allLogs[userId].length > 30) {
      allLogs[userId] = allLogs[userId].slice(0, 30);
    }
    
    writeJSON(SLEEP_LOGS_PATH, allLogs);
    return allLogs[userId][0];
  }

  deleteLog(userId: string, logId: string) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    if (allLogs[userId]) {
      allLogs[userId] = allLogs[userId].filter(log => log.id !== logId);
      writeJSON(SLEEP_LOGS_PATH, allLogs);
    }
    return { success: true };
  }

  getTodayStats(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getLogs(userId);
    const todayLog = logs.find(log => log.date === today);
    return todayLog || null;
  }
}
