import { useState } from 'react';
import '../styles/components.css';

const moods = ['😔', '😕', '😊', '😄', '🤩'];

export default function MoodSelector() {
  const [selected, setSelected] = useState(2); // default '😊'

  return (
    <div className="mood-row">
      {moods.map((mood, idx) => (
        <div
          key={idx}
          className={`mood-btn ${idx === selected ? 'sel' : ''}`}
          onClick={() => setSelected(idx)}
        >
          {mood}
        </div>
      ))}
    </div>
  );
}