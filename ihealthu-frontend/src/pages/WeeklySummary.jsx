import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import api from '../services/api'
import styles from '../styles/WeeklySummary.module.css'

export default function WeeklySummary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('calories')

  const metricsInfo = {
    calories: { label: 'Calories Burned', unit: 'kcal', color: '#ff7e5f', maxDefault: 500 },
    water: { label: 'Water Intake', unit: 'L', color: '#6ba8c4', maxDefault: 3 },
    sleep: { label: 'Sleep Duration', unit: 'h', color: '#baabff', maxDefault: 10 },
    activeMinutes: { label: 'Active Time', unit: 'min', color: '#a8d5c2', maxDefault: 60 }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const res = await api.get('/dashboard/summary')
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch summary', err)
      setError('Could not load summary data. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Generating your weekly report...</p>
    </div>
  )

  if (error) return (
    <div className={styles.errorPage}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <p>{error}</p>
      <button onClick={fetchSummary} className="btn-primary" style={{ marginTop: 20 }}>Retry</button>
    </div>
  )

  const currentMetric = metricsInfo[activeTab]
  
  const chartData = data?.dailyData?.map(d => {
    const dateObj = new Date(d.dateStr)
    return {
      ...d,
      displayDate: `${d.day} ${dateObj.getDate()}/${dateObj.getMonth() + 1}`
    }
  }) || []

  const maxVal = chartData.length > 0 
    ? Math.max(...chartData.map(d => Number(d[activeTab]) || 0), currentMetric.maxDefault) 
    : currentMetric.maxDefault

  const bestDay = data?.dailyData?.reduce((prev, current) => 
    (Number(prev[activeTab]) || 0) > (Number(current[activeTab]) || 0) ? prev : current
  )
  
  const weeklyTotal = data?.dailyData?.reduce((acc, curr) => acc + (Number(curr[activeTab]) || 0), 0)
  const weeklyAvg = data?.dailyData ? (weeklyTotal / data.dailyData.length) : 0

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Performance Review</div>
          <h1 className="page-title">📊 Weekly <span>Summary</span></h1>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🔥</div>
          <div className={styles.cardLabel}>Weekly Burn</div>
          <div className={styles.cardVal}>{data.totalCalories} <span>kcal</span></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🏋️</div>
          <div className={styles.cardLabel}>Workouts</div>
          <div className={styles.cardVal}>{data.totalWorkouts} <span>sessions</span></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>⏱️</div>
          <div className={styles.cardLabel}>Active Time</div>
          <div className={styles.cardVal}>{data.totalDuration} <span>min</span></div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header" style={{ marginBottom: 16 }}>
          <div className="panel-title">{currentMetric.label} Trend</div>
        </div>
        
        <div className={styles.tabsContainer}>
          {Object.entries(metricsInfo).map(([key, info]) => (
            <button 
              key={key}
              className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {info.label}
            </button>
          ))}
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'var(--text3)', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'var(--text3)' }} 
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--text1)', marginBottom: '4px' }}
                itemStyle={{ color: currentMetric.color, fontWeight: 'bold' }}
                formatter={(value) => [`${Number(value).toFixed(activeTab === 'water' ? 1 : 0)} ${currentMetric.unit}`, currentMetric.label]}
              />
              <Area 
                type="monotone" 
                dataKey={activeTab} 
                stroke={currentMetric.color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMetric)" 
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Wellness Insights</div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>✅</div>
            <div className={styles.insightText}>
              Your best day for {currentMetric.label.toLowerCase()} was <strong>{bestDay?.day || 'N/A'}</strong> with <strong>{Number(bestDay?.[activeTab] || 0).toFixed(activeTab === 'water' ? 1 : 0)} {currentMetric.unit}</strong>.
            </div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>💡</div>
            <div className={styles.insightText}>
              You are averaging <strong>{weeklyAvg.toFixed(activeTab === 'water' ? 1 : 0)} {currentMetric.unit}</strong> per day this week.
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Goal Adherence</div>
          </div>
          <div className={styles.goalLine}>
            <span>Calories Target</span>
            <strong>{data.goals.calories || 0} kcal</strong>
          </div>
          <div className={styles.goalLine}>
            <span>Water Target</span>
            <strong>{data.goals.water || 0} Litres</strong>
          </div>
          <div className={styles.goalLine}>
            <span>Sleep Target</span>
            <strong>{data.goals.sleep || 0} hours</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
