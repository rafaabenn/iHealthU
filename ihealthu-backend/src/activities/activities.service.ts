import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/activities.json');

function readActivities() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeActivities(data: any[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class ActivitiesService {
  findAll() {
    return readActivities();
  }

  create(body: any) {
    const activities = readActivities();
    const newActivity = { id: Date.now().toString(), ...body };
    activities.unshift(newActivity);
    writeActivities(activities);
    return newActivity;
  }

  update(id: string, body: any) {
    const activities = readActivities();
    const index = activities.findIndex((a: any) => a.id === id);
    if (index === -1) throw new NotFoundException('Activity not found');
    activities[index] = { ...activities[index], ...body };
    writeActivities(activities);
    return activities[index];
  }

  remove(id: string) {
    const activities = readActivities();
    const filtered = activities.filter((a: any) => a.id !== id);
    if (filtered.length === activities.length) throw new NotFoundException('Activity not found');
    writeActivities(filtered);
    return { message: 'Deleted' };
  }
}