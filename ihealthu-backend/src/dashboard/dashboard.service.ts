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

    // Filter today's and yesterday's activities
    const todayActivities = activities.filter((a: any) =>
      a.date?.startsWith(today)
    );
    const yesterdayActivities = activities.filter((a: any) =>
      a.date?.startsWith(yesterday)
    );

    // Calories
    const calories = todayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.calories || 0), 0
    );
    const caloriesYesterday = yesterdayActivities.reduce(
      (sum: number, a: any) => sum + Number(a.calories || 0), 0
    );
    const caloriesDelta = caloriesYesterday > 0
      ? Math.round(((calories - caloriesYesterday) / caloriesYesterday) * 100)
      : null;

    // Workouts list for dashboard cards
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
}