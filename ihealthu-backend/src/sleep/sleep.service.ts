import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StreakService } from '../auth/streak.service';
import { GoalsService } from '../goals/goals.service';
import { getLocalDateString } from '../common/utils/date.utils';

const SLEEP_LOGS_PATH = path.join(__dirname, '../../data/sleep_logs.json');
const ACTIVITIES_PATH = path.join(__dirname, '../../data/activities.json');
const WATER_LOGS_PATH = path.join(__dirname, '../../data/water_logs.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
  catch { return null; }
}

@Injectable()
export class SleepService {
  constructor(
    private readonly streakService: StreakService,
    private readonly goalsService: GoalsService,
  ) { }

  getLogs(userId: string, endDateParam?: string) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    const userLogs = allLogs[userId] ?? [];

    if (!endDateParam) return userLogs;

    const end = new Date(endDateParam);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end.getTime() - 7 * 86400000);
    start.setHours(0, 0, 0, 0);

    return userLogs.filter((log: any) => {
      const d = new Date(log.date);
      return d >= start && d <= end;
    });
  }

  addLog(userId: string, data: { date: string; startTime: string; endTime: string; duration: number }) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    if (!allLogs[userId]) allLogs[userId] = [];

    const existingIndex = allLogs[userId].findIndex((log: any) => log.date === data.date);

    let result;
    if (existingIndex !== -1) {
      allLogs[userId][existingIndex] = {
        ...allLogs[userId][existingIndex],
        ...data
      };
      result = allLogs[userId][existingIndex];
    } else {
      const newLog = {
        id: Date.now().toString(),
        ...data
      };
      allLogs[userId].unshift(newLog);
      result = newLog;
    }

    allLogs[userId].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    
    if (allLogs[userId].length > 30) {
      allLogs[userId] = allLogs[userId].slice(0, 30);
    }

    fs.writeFileSync(SLEEP_LOGS_PATH, JSON.stringify(allLogs, null, 2));
    
    
    this.syncStreak(userId);

    return result;
  }

  deleteLog(userId: string, logId: string) {
    const allLogs = readJSON(SLEEP_LOGS_PATH) ?? {};
    if (allLogs[userId]) {
      allLogs[userId] = allLogs[userId].filter(log => log.id !== logId);
      fs.writeFileSync(SLEEP_LOGS_PATH, JSON.stringify(allLogs, null, 2));
      
      
      this.syncStreak(userId);
    }
    return { success: true };
  }

  getTodayStats(userId: string) {
    const today = getLocalDateString();
    const logs = this.getLogs(userId);
    const todayLog = logs.find(log => log.date === today);
    return todayLog || null;
  }

  private syncStreak(userId: string) {
    const today = getLocalDateString();
    const goals = this.goalsService.findAll(userId);
    
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};
    
    const activities = allActivities.filter((a: any) => a.userId === userId);
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? [];

    const todayActivities = activities.filter((a: any) => a.date?.startsWith(today));
    const calories = todayActivities.reduce((sum, a) => sum + Number(a.calories || 0), 0);
    const activeMinutes = todayActivities.reduce((sum, a) => sum + Number(a.duration || 0), 0);
    const water = Number(userWater[today] || 0);

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    
    const sleepLogs = Array.isArray(userSleep) ? userSleep : Object.entries(userSleep).map(([date, v]: [string, any]) => ({ date, ...v }));
    const latestSleepLog = sleepLogs[0];
    const isTodayOrYesterday = latestSleepLog && (latestSleepLog.date === today || latestSleepLog.date === yesterday);
    const sleep = isTodayOrYesterday ? Number(latestSleepLog.duration) : 0;

    this.streakService.checkAndUpdateStreak(
      userId,
      { calories, activeMinutes, water, sleep },
      goals
    );
  }
}

