import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StreakService } from '../auth/streak.service';

const ACTIVITIES_PATH = path.join(__dirname, '../../data/activities.json');
const GOALS_PATH      = path.join(__dirname, '../../data/goals.json');
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
  constructor(private readonly streakService: StreakService) {}

  getToday(userId: string) {
    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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

    // Find the most recent sleep log
    const userSleepArr = sleepArray(userSleep);
    const latestSleep: any = userSleepArr.length > 0 ? userSleepArr[0] : null;

    const currentStreak = this.streakService.checkAndUpdateStreak(
      userId,
      { calories, activeMinutes },
      goals,
    );

    return {
      activeMinutes,
      activeMinutesDelta,
      activeMinutesGoal: Number(goals.dailyActiveMinutes) || 30,
      calories,
      caloriesDelta,
      water:          Number(userWater[today] || 0),
      dailyWaterGoal: Number(goals.dailyWater) || 2.0,
      sleep:          latestSleep ? Number(latestSleep.duration) : 0,
      sleepGoal:      Number(goals.sleepHours) || 8,
      workouts,
      currentStreak,
    };
  }

  updateWater(userId: string, amount: number) {
    const today    = new Date().toISOString().split('T')[0];
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};

    if (!allWater[userId]) allWater[userId] = {};
    allWater[userId][today] = amount;

    writeJSON(WATER_LOGS_PATH, allWater);
    return { success: true, water: amount };
  }

  getSleepLogs(userId: string) {
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};
    return sleepArray(allSleep[userId]);
  }

  logSleep(userId: string, sleepData: { bedtime: string; waketime: string; duration: number }) {
    const date     = new Date().toISOString().split('T')[0];
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};

    // Migrate old object-keyed format → array on first write
    allSleep[userId] = sleepArray(allSleep[userId]);

    const existingIndex = allSleep[userId].findIndex((log: any) => log.date === date);

    if (existingIndex !== -1) {
      allSleep[userId][existingIndex] = {
        ...allSleep[userId][existingIndex],
        ...sleepData,
        loggedAt: new Date().toISOString(),
      };
      writeJSON(SLEEP_LOGS_PATH, allSleep);
      return { success: true, log: allSleep[userId][existingIndex] };
    }

    const newLog = {
      id:       Date.now().toString(),
      date,
      bedtime:  sleepData.bedtime,
      waketime: sleepData.waketime,
      duration: sleepData.duration,
      loggedAt: new Date().toISOString(),
    };

    allSleep[userId].unshift(newLog);
    allSleep[userId].sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    writeJSON(SLEEP_LOGS_PATH, allSleep);
    return { success: true, log: newLog };
  }

  getSummary(userId: string) {
    const allActivities: any[]          = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH)      ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};
 
    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};
    const userSleepArr = sleepArray(userSleep);
 
    const now = new Date();
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

    const dailyData: Array<{ day: string; calories: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d       = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayActivities = activities.filter((a: any) => a.date === dateStr);
      const dayCals = dayActivities.reduce(
        (sum: number, a: any) => sum + Number(a.calories || 0), 0,
      );
      dailyData.push({ day: dayName, calories: dayCals });
    }

    const todayStr = new Date().toISOString().split('T')[0];
 
    return {
      totalCalories,
      totalWorkouts,
      totalDuration,
      dailyData,
      goals: {
        water:         goals.dailyWater         || 0,
        sleep:         goals.sleepHours         || 0,
        activeMinutes: goals.dailyActiveMinutes  || 0,
      },
      currentWater: Number(userWater[todayStr] || 0),
      currentSleep: userSleepArr.find((s: any) => s.date === todayStr)?.duration || 0,
    };
  }
}
