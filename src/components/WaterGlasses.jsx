import { useState } from 'react';
import '../styles/components.css';

export default function WaterGlasses({ initial = 6, total = 8, onToggle }) {
  const [filled, setFilled] = useState(initial);

  const handleClick = (index) => {
    const newFilled = index < filled ? index : index + 1;
    setFilled(newFilled);
    onToggle?.(newFilled);
  };

  return (
    <div className="water-glasses">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`glass ${i < filled ? 'filled' : ''}`}
          onClick={() => handleClick(i)}
        >
          {i < filled ? '💧' : '○'}
        </div>
      ))}
    </div>
  );
}