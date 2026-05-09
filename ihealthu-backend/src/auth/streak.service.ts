import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const USERS_PATH = path.join(__dirname, '../../data/users.json');
const DAILY_PATH = path.join(__dirname, '../../data/daily.json');

function readUsers(): any[] {
  if (!fs.existsSync(USERS_PATH)) return [];
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}

function writeUsers(users: any[]) {
  fs.mkdirSync(path.dirname(USERS_PATH), { recursive: true });
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function readDaily(): Record<string, any> {
  if (!fs.existsSync(DAILY_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(DAILY_PATH, 'utf-8')); }
  catch { return {}; }
}

interface TodayStats {
  calories: number;
  activeMinutes: number;
}

interface UserGoals {
  dailyCalories?: string | number;
  dailyActiveMinutes?: string | number;
  dailyWater?: string | number;
  sleepHours?: string | number;
}

@Injectable()
export class StreakService {

  checkAndUpdateStreak(userId: string, activityStats: TodayStats, goals: UserGoals): number {
    const users = readUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return 0;

    const user = users[userIndex];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = new Date().toISOString().split('T')[0];

    const lastDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    // Déjà vérifié aujourd'hui → retourne sans toucher la DB
    if (lastDate && lastDate.getTime() === today.getTime()) {
      return user.currentStreak ?? 0;
    }

    // Lire les données water + sleep du jour depuis daily.json
    const daily = readDaily();
    const dailyKey = `${userId}_${todayStr}`;
    const todayDaily = daily[dailyKey] ?? { water: 0, sleep: 0 };

    const allGoalsMet = this.areAllGoalsMet(activityStats, todayDaily, goals);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const missedDay = lastDate !== null && lastDate.getTime() < yesterday.getTime();

    if (allGoalsMet) {
      user.currentStreak = missedDay ? 1 : (user.currentStreak ?? 0) + 1;
      user.lastStreakDate = todayStr;
      users[userIndex] = user;
      writeUsers(users);
    } else if (missedDay) {
      user.currentStreak = 0;
      user.lastStreakDate = null;
      users[userIndex] = user;
      writeUsers(users);
    }
    // Goals pas atteints + pas de missed day → on ne touche rien

    return user.currentStreak ?? 0;
  }

  private areAllGoalsMet(
    activityStats: TodayStats,
    todayDaily: { water: number; sleep: number },
    goals: UserGoals,
  ): boolean {
    const checks: boolean[] = [];

    if (Number(goals.dailyCalories) > 0)
      checks.push(activityStats.calories >= Number(goals.dailyCalories));

    if (Number(goals.dailyActiveMinutes) > 0)
      checks.push(activityStats.activeMinutes >= Number(goals.dailyActiveMinutes));

    if (Number(goals.dailyWater) > 0)
      checks.push(todayDaily.water >= Number(goals.dailyWater));

    if (Number(goals.sleepHours) > 0)
      checks.push(todayDaily.sleep >= Number(goals.sleepHours));

    // Aucun goal défini → streak impossible
    return checks.length > 0 && checks.every(Boolean);
  }
}