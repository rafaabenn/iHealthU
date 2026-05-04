import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Panel from '../components/Panel';
import { calcBMI } from '../utils/bmiCalculator';
import '../styles/bmi.css';

export default function BmiPage() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(62);
  const [data, setData] = useState(() => calcBMI(170, 62));

  useEffect(() => {
    setData(calcBMI(height, weight));
  }, [height, weight]);

  const markerLeft = Math.min(Math.max((data.bmi - 10) / 30 * 100, 0), 100);

  return (
    <div className="page">
      <Topbar subtitle="Body mass index" title="⚖️ BMI Calculator" />
      <div className="bmi-page-grid">
        <Panel title="Your measurements">
          <div className="range-slider-group">
            <div className="slider-label">
              <label className="form-label">Height</label>
              <span>{height} cm</span>
            </div>
            <input type="range" min="140" max="210" value={height}
              onChange={e => setHeight(Number(e.target.value))}
            />
          </div>
          <div className="range-slider-group">
            <div className="slider-label">
              <label className="form-label">Weight</label>
              <span>{weight} kg</span>
            </div>
            <input type="range" min="40" max="150" value={weight}
              onChange={e => setWeight(Number(e.target.value))}
            />
          </div>
          <div className="bmi-info-grid">
            <div className="bmi-info-card">
              <div className="bmi-info-label">Healthy weight range</div>
              <div className="bmi-info-val">{data.range}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Ideal weight</div>
              <div className="bmi-info-val">{data.ideal}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Weight to adjust</div>
              <div className="bmi-info-val" style={{ color: data.diffColor }}>{data.diffText}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Category</div>
              <div className="bmi-info-val" style={{ color: data.color }}>{data.category}</div>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="bmi-result-box">
            <div className="bmi-result-num" style={{ color: data.color }}>{data.bmi.toFixed(1)}</div>
            <div className="bmi-result-cat" style={{ color: data.color }}>{data.category}</div>
          </div>
          <div className="bmi-scale">
            <div className="bmi-marker" style={{ left: `${markerLeft}%` }} />
          </div>
          <div className="bmi-scale-labels">
            <span>Underweight<br />&lt;18.5</span>
            <span>Normal<br />18.5–25</span>
            <span>Overweight<br />25–30</span>
            <span>Obese<br />&gt;30</span>
          </div>
          <div style={{ marginTop: 24, background: 'var(--bg)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>What does this mean?</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{data.advice}</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}