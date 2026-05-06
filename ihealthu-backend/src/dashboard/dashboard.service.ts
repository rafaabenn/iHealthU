import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const ACTIVITIES_PATH = path.join(__dirname, '../../data/activities.json');
const GOALS_PATH = path.join(__dirname, '../../data/goals.json');

function readJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const ICONS: Record<string, string> = {
  Running: '🏃', Cycling: '🚴', Swimming: '🏊',
  Yoga: '🧘', 'Weight training': '🏋️', Walking: '👟',
  HIIT: '⚡', Other: '🤸',
};

@Injectable()
export class DashboardService {
  getToday() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const activities = readJSON(ACTIVITIES_PATH) || [];
    const goals = readJSON(GOALS_PATH) || {};

    const todayActivities = activities.filter((a: any) => a.date?.startsWith(today));
    const yesterdayActivities = activities.filter((a: any) => a.date?.startsWith(yesterday));

    const calories = todayActivities.reduce((sum: number, a: any) => sum + Number(a.calories || 0), 0);
    const caloriesYesterday = yesterdayActivities.reduce((sum: number, a: any) => sum + Number(a.calories || 0), 0);
    const caloriesDelta = caloriesYesterday > 0
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
      steps: 0,
      stepsDelta: null,
      calories,
      caloriesDelta,
      water: Number(goals.dailyWater) || 0,
      sleep: Number(goals.sleepHours) || 0,
      workouts,
    };
  }

  getSummary() {
    const activities = readJSON(ACTIVITIES_PATH) || [];
    const goals = readJSON(GOALS_PATH) || {};

    // Get current date at midnight for comparison
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    weekAgo.setHours(0, 0, 0, 0);
    
    const weekActivities = activities.filter((a: any) => {
      const d = new Date(a.date);
      return d >= weekAgo && d <= now;
    });

    const totalCalories = weekActivities.reduce((sum: number, a: any) => sum + Number(a.calories || 0), 0);
    const totalWorkouts = weekActivities.length;
    const totalDuration = weekActivities.reduce((sum: number, a: any) => sum + Number(a.duration || 0), 0);

    // Group by day for chart (Last 7 days including today)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayActivities = activities.filter((a: any) => a.date === dateStr);
      const dayCals = dayActivities.reduce((sum: number, a: any) => sum + Number(a.calories || 0), 0);
      
      dailyData.push({ day: dayName, calories: dayCals });
    }

    return {
      totalCalories,
      totalWorkouts,
      totalDuration,
      dailyData,
      goals: {
        water: goals.dailyWater || 0,
        sleep: goals.sleepHours || 0,
        weight: goals.weightGoal || 0
      }
    };
  }
}