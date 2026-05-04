export function estimateCalories(met, durationMin, weightKg) {
  return Math.round(met * weightKg * (durationMin / 60));
}