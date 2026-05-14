import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getLocalDateString } from '../common/utils/date.utils';

const USERS_PATH = path.join(__dirname, '../../data/users.json');

function readUsers(): any[] {
  if (!fs.existsSync(USERS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeUsers(users: any[]) {
  fs.mkdirSync(path.dirname(USERS_PATH), { recursive: true });
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

export interface TodayStats {
  calories: number;
  activeMinutes: number;
  water: number;
  sleep: number;
}

interface UserGoals {
  dailyCalories?: string | number;
  dailyActiveMinutes?: string | number;
  dailyWater?: string | number;
  sleepHours?: string | number;
}

@Injectable()
export class StreakService {

  checkAndUpdateStreak(userId: string, stats: TodayStats, goals: UserGoals): number {
    const users = readUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return 0;

    const user = users[userIndex];
    const todayStr = getLocalDateString();
    
    // Check if we already incremented today
    if (user.lastStreakDate === todayStr) {
      return user.currentStreak ?? 0;
    }

    const allGoalsMet = this.areAllGoalsMet(stats, goals);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    // A missed day is when the last update was BEFORE yesterday
    const lastDateStr = user.lastStreakDate;
    const missedDay = lastDateStr && lastDateStr < yesterdayStr;

    if (allGoalsMet) {
      // If we missed a day, reset to 1, otherwise increment
      user.currentStreak = missedDay ? 1 : (user.currentStreak ?? 0) + 1;
      user.lastStreakDate = todayStr;
      users[userIndex] = user;
      writeUsers(users);
    } else if (missedDay) {
      // If goals not met AND we missed yesterday, reset to 0
      user.currentStreak = 0;
      user.lastStreakDate = null;
      users[userIndex] = user;
      writeUsers(users);
    }

    return user.currentStreak ?? 0;
  }

  private areAllGoalsMet(
    stats: TodayStats,
    goals: UserGoals,
  ): boolean {
    const checks: boolean[] = [];

    if (Number(goals.dailyCalories) > 0)
      checks.push(stats.calories >= Number(goals.dailyCalories));

    if (Number(goals.dailyActiveMinutes) > 0)
      checks.push(stats.activeMinutes >= Number(goals.dailyActiveMinutes));

    if (Number(goals.dailyWater) > 0)
      checks.push(stats.water >= Number(goals.dailyWater));

    if (Number(goals.sleepHours) > 0)
      checks.push(stats.sleep >= Number(goals.sleepHours));

    // Must have at least one goal defined and all met
    return checks.length > 0 && checks.every(Boolean);
  }
}