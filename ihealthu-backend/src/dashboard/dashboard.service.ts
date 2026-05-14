import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StreakService } from '../auth/streak.service';
import { getLocalDateString } from '../common/utils/date.utils';

const ACTIVITIES_PATH = path.join(__dirname, '../../data/activities.json');
const GOALS_PATH = path.join(__dirname, '../../data/goals.json');
const WATER_LOGS_PATH = path.join(__dirname, '../../data/water_logs.json');
const SLEEP_LOGS_PATH = path.join(__dirname, '../../data/sleep_logs.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/** Normalises both old (object keyed by date) and new (array) sleep formats. */
function sleepArray(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).map(([date, v]: [string, any]) => ({ date, ...v }));
}

const ICONS: Record<string, string> = {
  Running: '🏃', Cycling: '🚴', Swimming: '🏊',
  Yoga: '🧘', 'Weight training': '🏋️', Walking: '👟',
  HIIT: '⚡', Other: '🤸',
};

@Injectable()
export class DashboardService {
  constructor(private readonly streakService: StreakService) { }

  getToday(userId: string) {
    const today = getLocalDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};

    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};

    const todayActivities = activities.filter((a) => a.date?.startsWith(today));
    const yesterdayActivities = activities.filter((a) => a.date?.startsWith(yesterday));

    const activeMinutes = todayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.duration || 0), 0,
    );
    const activeMinutesYesterday = yesterdayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.duration || 0), 0,
    );
    const activeMinutesDelta =
      activeMinutesYesterday > 0
        ? Math.round(((activeMinutes - activeMinutesYesterday) / activeMinutesYesterday) * 100)
        : null;

    const calories = todayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.calories || 0), 0,
    );
    const caloriesYesterday = yesterdayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.calories || 0), 0,
    );
    const caloriesDelta =
      caloriesYesterday > 0
        ? Math.round(((calories - caloriesYesterday) / caloriesYesterday) * 100)
        : null;

    const workouts = todayActivities.map((a: any) => ({
      icon: ICONS[a.type] || '🤸',
      name: a.type,
      duration: a.duration,
      date: 'Today',
      calories: a.calories,
    }));

    const userSleepArr = sleepArray(userSleep);
    const latestSleepLog = userSleepArr[0];
    const isTodayOrYesterday = latestSleepLog && (latestSleepLog.date === today || latestSleepLog.date === yesterday);
    const sleep = isTodayOrYesterday ? Number(latestSleepLog.duration) : 0;
    const water = Number(userWater[today] || 0);

    const currentStreak = this.streakService.checkAndUpdateStreak(
      userId,
      { calories, activeMinutes, water, sleep },
      goals,
    );

    return {
      activeMinutes,
      activeMinutesDelta,
      activeMinutesGoal: Number(goals.dailyActiveMinutes) || 30,
      calories,
      caloriesGoal: Number(goals.dailyCalories) || 500,
      caloriesDelta,
      water,
      dailyWaterGoal: Number(goals.dailyWater) || 2.0,
      sleep,
      sleepGoal: Number(goals.sleepHours) || 8,
      workouts,
      currentStreak,
    };
  }

  updateWater(userId: string, amount: number) {
    const today = getLocalDateString();
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};

    if (!allWater[userId]) allWater[userId] = {};
    allWater[userId][today] = amount;

    writeJSON(WATER_LOGS_PATH, allWater);

    // Sync streak immediately
    this.syncStreak(userId);

    return { success: true, water: amount };
  }

  private syncStreak(userId: string) {
    const today = getLocalDateString();
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};

    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};

    const todayActivities = activities.filter((a) => a.date?.startsWith(today));
    const calories = todayActivities.reduce((sum, a) => sum + Number(a.calories || 0), 0);
    const activeMinutes = todayActivities.reduce((sum, a) => sum + Number(a.duration || 0), 0);
    const water = Number(userWater[today] || 0);
    const userSleepArr = sleepArray(userSleep);
    const latestSleepLog = userSleepArr[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);
    const isTodayOrYesterday = latestSleepLog && (latestSleepLog.date === today || latestSleepLog.date === yesterday);
    const sleep = isTodayOrYesterday ? Number(latestSleepLog.duration) : 0;

    this.streakService.checkAndUpdateStreak(
      userId,
      { calories, activeMinutes, water, sleep },
      goals
    );
  }

  getSummary(userId: string, endDateParam?: string) {
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};

    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};
    const userSleepArr = sleepArray(userSleep);

    const now = endDateParam ? new Date(endDateParam) : new Date();
    now.setHours(23, 59, 59, 999);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    weekAgo.setHours(0, 0, 0, 0);

    const weekActivities = activities.filter((a: any) => {
      const d = new Date(a.date);
      return d >= weekAgo && d <= now;
    });

    const totalCalories = weekActivities.reduce(
      (sum: number, a: any) => sum + Number(a.calories || 0), 0,
    );
    const totalWorkouts = weekActivities.length;
    const totalDuration = weekActivities.reduce(
      (sum: number, a: any) => sum + Number(a.duration || 0), 0,
    );

    const dailyData: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = endDateParam ? new Date(endDateParam) : new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayActivities = activities.filter((a: any) => a.date === dateStr || a.date?.startsWith(dateStr));
      const dayCals = dayActivities.reduce(
        (sum: number, a: any) => sum + Number(a.calories || 0), 0,
      );
      const dayMinutes = dayActivities.reduce(
        (sum: number, a: any) => sum + Number(a.duration || 0), 0,
      );

      const dayWater = Number(userWater[dateStr] || 0);
      const sleepLog = userSleepArr.find((s: any) => s.date === dateStr);
      const daySleep = sleepLog ? Number(sleepLog.duration || 0) : 0;

      dailyData.push({
        day: dayName,
        dateStr,
        calories: dayCals,
        water: dayWater,
        sleep: daySleep,
        activeMinutes: dayMinutes,
      });
    }

    const todayStr = getLocalDateString();

    return {
      totalCalories,
      totalWorkouts,
      totalDuration,
      dailyData,
      goals: {
        water: goals.dailyWater || 0,
        sleep: goals.sleepHours || 0,
        activeMinutes: goals.dailyActiveMinutes || 0,
        calories: goals.dailyCalories || 0,
      },
      currentWater: Number(userWater[todayStr] || 0),
      currentSleep: userSleepArr.find((s: any) => s.date === todayStr)?.duration || 0,
    };
  }
}

