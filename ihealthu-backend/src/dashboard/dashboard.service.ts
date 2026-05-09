import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StreakService } from '../auth/streak.service';

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

const ICONS: Record<string, string> = {
  Running: '🏃', Cycling: '🚴', Swimming: '🏊',
  Yoga: '🧘', 'Weight training': '🏋️', Walking: '👟',
  HIIT: '⚡', Other: '🤸',
};

@Injectable()
export class DashboardService {
  constructor(private readonly streakService: StreakService) {}

  getToday(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
<<<<<<< HEAD
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};
 
    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};
 
=======

    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};

>>>>>>> main
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

<<<<<<< HEAD
    // Find the most recent sleep log
    const sleepLogs = userSleep ? Object.values(userSleep) : [];
    const latestSleep: any = sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1] : null;
=======
    const currentStreak = this.streakService.checkAndUpdateStreak(
      userId,
      { calories, activeMinutes },
      goals,
    );
>>>>>>> main

    return {
      activeMinutes,
      activeMinutesDelta,
      activeMinutesGoal: Number(goals.dailyActiveMinutes) || 30,
      calories,
      caloriesDelta,
      water: Number(userWater[today] || 0),
      dailyWaterGoal: Number(goals.dailyWater) || 2.0,
      sleep: latestSleep ? Number(latestSleep.duration) : 0,
      sleepGoal: Number(goals.sleepHours) || 8,
      workouts,
      currentStreak,
    };
  }

<<<<<<< HEAD
  updateWater(userId: string, amount: number) {
    const today = new Date().toISOString().split('T')[0];
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};
    
    if (!allWater[userId]) allWater[userId] = {};
    allWater[userId][today] = amount;
    
    writeJSON(WATER_LOGS_PATH, allWater);
    return { success: true, water: amount };
  }

  getSleepLogs(userId: string) {
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};
    const userSleep = allSleep[userId] ?? {};
    // Return sorted by date descending
    return Object.entries(userSleep)
      .map(([date, data]: [string, any]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  logSleep(userId: string, sleepData: { bedtime: string; waketime: string; duration: number }) {
    const date = new Date().toISOString().split('T')[0];
    const allSleep = readJSON(SLEEP_LOGS_PATH) ?? {};
    
    if (!allSleep[userId]) allSleep[userId] = {};
    allSleep[userId][date] = {
      ...sleepData,
      loggedAt: new Date().toISOString()
    };
    
    writeJSON(SLEEP_LOGS_PATH, allSleep);
    return { success: true, log: allSleep[userId][date] };
  }
 
  getSummary(userId: string) {
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
    const allSleep: Record<string, any> = readJSON(SLEEP_LOGS_PATH) ?? {};
 
    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
    const userSleep = allSleep[userId] ?? {};
 
=======
  getSummary(userId: string) {
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};

    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};

>>>>>>> main
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
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayActivities = activities.filter((a: any) => a.date === dateStr);
      const dayCals = dayActivities.reduce(
        (sum: number, a: any) => sum + Number(a.calories || 0), 0,
      );
      dailyData.push({ day: dayName, calories: dayCals });
    }

<<<<<<< HEAD
    const todayStr = new Date().toISOString().split('T')[0];
 
=======
>>>>>>> main
    return {
      totalCalories,
      totalWorkouts,
      totalDuration,
      dailyData,
      goals: {
        water: goals.dailyWater || 0,
        sleep: goals.sleepHours || 0,
        weight: goals.targetWeight || 0,
        activeMinutes: goals.dailyActiveMinutes || 0,
      },
      currentWater: Number(userWater[todayStr] || 0),
      currentSleep: userSleep[todayStr] ? userSleep[todayStr].duration : 0
    };
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> main
