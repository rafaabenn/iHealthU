import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const ACTIVITIES_PATH = path.join(__dirname, '../../data/activities.json');
const GOALS_PATH = path.join(__dirname, '../../data/goals.json');
const WATER_LOGS_PATH = path.join(__dirname, '../../data/water_logs.json');

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
  getToday(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
 
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
 
    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
 
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

    return {
      activeMinutes,
      activeMinutesDelta,
      activeMinutesGoal: Number(goals.dailyActiveMinutes) || 30,
      calories,
      caloriesDelta,
      water: Number(userWater[today] || 0),
      dailyWaterGoal: Number(goals.dailyWater) || 2.0,
      sleep: Number(goals.sleepHours) || 0,
      workouts,
    };
  }

  updateWater(userId: string, amount: number) {
    const today = new Date().toISOString().split('T')[0];
    const allWater = readJSON(WATER_LOGS_PATH) ?? {};
    
    if (!allWater[userId]) allWater[userId] = {};
    allWater[userId][today] = amount;
    
    writeJSON(WATER_LOGS_PATH, allWater);
    return { success: true, water: amount };
  }
 
  getSummary(userId: string) {
    const allActivities: any[] = readJSON(ACTIVITIES_PATH) ?? [];
    const allGoals: Record<string, any> = readJSON(GOALS_PATH) ?? {};
    const allWater: Record<string, any> = readJSON(WATER_LOGS_PATH) ?? {};
 
    const activities = allActivities.filter((a) => a.userId === userId);
    const goals = allGoals[userId] ?? {};
    const userWater = allWater[userId] ?? {};
 
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

    const todayStr = new Date().toISOString().split('T')[0];
 
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
      currentWater: Number(userWater[todayStr] || 0)
    };
  }
}
