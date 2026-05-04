export function calcBMI(heightCm, weightKg) {
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  const categories = [
    { max: 18.5, label: 'Underweight', color: '#6BA8C4', advice: 'Your BMI is below the healthy range. Consider consulting a healthcare provider.' },
    { max: 25, label: 'Normal weight', color: '#4A7C6F', advice: 'Your BMI is within the healthy range. Keep up the good work!' },
    { max: 30, label: 'Overweight', color: '#E8A84A', advice: 'Your BMI is slightly above the healthy range. Small changes can make a big difference.' },
    { max: Infinity, label: 'Obese', color: '#E8715A', advice: 'Your BMI is significantly above the healthy range. A healthcare provider can help.' },
  ];
  const cat = categories.find(c => bmi < c.max);
  const lo = (18.5 * h * h).toFixed(1);
  const hi = (24.9 * h * h).toFixed(1);
  const ideal = ((parseFloat(lo) + parseFloat(hi)) / 2).toFixed(1);
  const diff = weightKg - (bmi < 18.5 ? parseFloat(hi) : bmi > 25 ? parseFloat(lo) : weightKg);
  const diffText = Math.abs(diff) < 0.1 ? 'In range ✓' : `${diff > 0 ? '-' : '+'}${Math.abs(diff).toFixed(1)} kg`;
  const diffColor = Math.abs(diff) < 0.1 ? 'var(--sage)' : diff > 0 ? 'var(--coral)' : 'var(--sky)';
  
  return {
    bmi: bmi,
    category: cat.label,
    color: cat.color,
    advice: cat.advice,
    range: `${lo} – ${hi} kg`,
    ideal: `${ideal} kg`,
    diffText,
    diffColor,
  };
}