import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StreakService } from '../auth/streak.service';
import { GoalsService } from '../goals/goals.service';
import { getLocalDateString } from '../common/utils/date.utils';

const DB_PATH = path.join(__dirname, '../../data/activities.json');
const WATER_LOGS_PATH = path.join(__dirname, '../../data/water_logs.json');
const SLEEP_LOGS_PATH = path.join(__dirname, '../../data/sleep_logs.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
  catch { return null; }
}

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly streakService: StreakService,
    private readonly goalsService: GoalsService,
  ) { }

  findAll(userId: string, endDateParam?: string) {
    const activities = this.readActivities();
    const userActivities = activities.filter((a: any) => a.userId === userId);

    if (!endDateParam) return userActivities;

    const end = new Date(endDateParam);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end.getTime() - 7 * 86400000);
    start.setHours(0, 0, 0, 0);

    return userActivities.filter((a: any) => {
      const d = new Date(a.date);
      return d >= start && d <= end;
    });
  }

  create(userId: string, body: any) {
    const activities = this.readActivities();
    const newActivity = { id: Date.now().toString(), userId, ...body };
    activities.unshift(newActivity);
    this.writeActivities(activities);

    
    this.syncStreak(userId);

    return newActivity;
  }

  update(userId: string, id: string, body: any) {
    const activities = this.readActivities();
    const index = activities.findIndex(
      (a: any) => a.id === id && a.userId === userId);
    if (index === -1) throw new NotFoundException('Activity not found');
    activities[index] = { ...activities[index], ...body };
    this.writeActivities(activities);

    
    this.syncStreak(userId);

    return activities[index];
  }

  remove(userId: string, id: string) {
    const activities = this.readActivities();
    const filtered = activities.filter(
      (a: any) => !(a.id === id && a.userId === userId))
    if (filtered.length === activities.length) throw new NotFoundException('Activity not found');
    this.writeActivities(filtered);
    return { message: 'Deleted' };
  }

  private syncStreak(userId: string) {
    const today = getLocalDateString();
    const activities = this.readActivities().filter((a: any) => a.userId === userId);
    const goals = this.goalsService.findAll(userId);
    
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};

    const todayActivities = activities.filter((a: any) => a.date?.startsWith(today));
    const calories = todayActivities.reduce((sum: number, a: any) => sum + Number(a.calories || 0), 0);
    const activeMinutes = todayActivities.reduce((sum: number, a: any) => sum + Number(a.duration || 0), 0);
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

  private readActivities() {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }

  private writeActivities(data: any[]) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }
}