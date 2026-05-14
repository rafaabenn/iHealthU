import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from '../styles/Dashboard.module.css'

import {
  Timer, Fire, Drop, Bed, Leaf,
  Barbell, Bicycle, Person, Footprints,
  Waves, Lightning, Heartbeat, HandWaving,
  Sun, Moon, CookingPot, X, CheckCircle,
  ApplePodcastsLogo, Lightning as Bolt,
  CaretLeft, CaretRight, InstagramLogo, GithubLogo
} from '@phosphor-icons/react'

import breakfastImg from '../assets/meals/breakfast.png'
import lunchImg from '../assets/meals/lunch.png'
import dinnerImg from '../assets/meals/dinner.png'
import snackImg from '../assets/meals/snack.png'
import preWorkoutImg from '../assets/meals/pre-workout.jpg'
import postWorkoutImg from '../assets/meals/post-workout.jpg'

const WORKOUT_ICONS = {
  Running: { icon: <Heartbeat size={17} weight="duotone" />, color: '#E85D3A', bg: 'rgba(232,93,58,0.1)' },
  Cycling: { icon: <Bicycle size={17} weight="duotone" />, color: '#3A9BE8', bg: 'rgba(58,155,232,0.1)' },
  Swimming: { icon: <Waves size={17} weight="duotone" />, color: '#3AB8E8', bg: 'rgba(58,184,232,0.1)' },
  Yoga: { icon: <Person size={17} weight="duotone" />, color: '#9B6FE8', bg: 'rgba(155,111,232,0.1)' },
  'Weight training': { icon: <Barbell size={17} weight="duotone" />, color: '#E8A23A', bg: 'rgba(232,162,58,0.1)' },
  Walking: { icon: <Footprints size={17} weight="duotone" />, color: '#5AE872', bg: 'rgba(90,232,114,0.1)' },
  HIIT: { icon: <Lightning size={17} weight="duotone" />, color: '#E8C83A', bg: 'rgba(232,200,58,0.1)' },
  Other: { icon: <Heartbeat size={17} weight="duotone" />, color: '#E85D9B', bg: 'rgba(232,93,155,0.1)' },
}

const QUOTES = [
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "The groundwork of all happiness is health.", author: "Leigh Hunt" },
  { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
  { text: "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.", author: "JFK" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
  { text: "Health is not valued until sickness comes.", author: "Thomas Fuller" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Small progress is still progress. Keep moving.", author: "iHealthU" }
]

const MEAL_SUGGESTIONS = [
  {
    type: 'Breakfast',
    title: 'Avocado & Poached Egg Toast',
    desc: 'Whole-grain toast topped with smashed avocado, a poached egg, chilli flakes and lemon zest.',
    kcal: 380,
    time: 10,
    protein: '22g',
    carbs: '34g',
    fats: '18g',
    color: '#E8A84A',
    bg: '#FFF8EE',
    icon: <Sun size={14} weight="fill" />,
    image: breakfastImg,
    ingredients: ['2 slices whole-grain bread', '1 ripe avocado', '2 large eggs', 'Chilli flakes', 'Lemon zest', 'Salt & pepper'],
    steps: ['Toast the bread.', 'Smash avocado with lemon and salt.', 'Poach eggs for 3-4 mins.', 'Spread avocado on toast.', 'Top with eggs and chilli flakes.']
  },
  {
    type: 'Lunch',
    title: 'Grilled Chicken & Quinoa Bowl',
    desc: 'Tender grilled chicken over quinoa with cherry tomatoes, cucumber, feta and a light tahini drizzle.',
    kcal: 520,
    time: 20,
    protein: '44g',
    carbs: '48g',
    fats: '14g',
    color: '#4A7C6F',
    bg: '#E8F4F0',
    icon: <Leaf size={14} weight="fill" />,
    image: lunchImg,
    ingredients: ['150g chicken breast', '1/2 cup quinoa', '1/2 cucumber', 'Cherry tomatoes', '30g feta', '1 tbsp tahini'],
    steps: ['Grill chicken.', 'Cook quinoa.', 'Mix veg and quinoa.', 'Top with chicken and feta.', 'Drizzle with tahini.']
  },
  {
    type: 'Dinner',
    title: 'Herb-Baked Salmon & Veggies',
    desc: 'Oven-baked salmon fillet with garlic, dill and lemon, served with roasted sweet potato.',
    kcal: 490,
    time: 30,
    protein: '38g',
    carbs: '22g',
    fats: '28g',
    color: '#6BA8C4',
    bg: '#EEF7FB',
    icon: <Moon size={14} weight="fill" />,
    image: dinnerImg,
    ingredients: ['1 salmon fillet', '1 sweet potato', 'Green beans', 'Fresh dill & garlic', 'Lemon', 'Olive oil'],
    steps: ['Preheat oven to 200°C.', 'Roast sweet potato cubes for 15 mins.', 'Add salmon and beans.', 'Season salmon with herbs.', 'Bake 12-15 more mins.']
  },
  {
    type: 'Snack',
    title: 'Greek Yogurt & Berry Medley',
    desc: 'Thick Greek yogurt topped with fresh blueberries, raspberries, granola and crushed walnuts.',
    kcal: 220,
    time: 5,
    protein: '18g',
    carbs: '24g',
    fats: '8g',
    color: '#9B6FE8',
    bg: '#F5F2FF',
    icon: <ApplePodcastsLogo size={14} weight="fill" />,
    image: snackImg,
    ingredients: ['200g Greek yogurt', 'Handful of blueberries', 'Handful of raspberries', '2 tbsp granola', '1 tbsp crushed walnuts'],
    steps: ['Spoon yogurt into a bowl.', 'Wash and add the berries.', 'Top with granola for crunch.', 'Sprinkle walnuts on top.']
  },
  {
    type: 'Pre-workout',
    title: 'Peanut Butter & Banana Toast',
    desc: 'Whole-grain toast with creamy peanut butter, sliced banana, and a drizzle of organic honey.',
    kcal: 310,
    time: 5,
    protein: '10g',
    carbs: '42g',
    fats: '12g',
    color: '#E8715A',
    bg: '#FFF2F0',
    icon: <Bolt size={14} weight="fill" />,
    image: preWorkoutImg,
    ingredients: ['1 slice whole-grain bread', '1 tbsp peanut butter', '1 small banana', '1 tsp honey', 'Pinch of cinnamon'],
    steps: ['Toast the bread.', 'Spread peanut butter evenly.', 'Slice banana and arrange on top.', 'Drizzle with honey.', 'Add a pinch of cinnamon.']
  },
  {
    type: 'Post-workout',
    title: 'Turkey & Spinach Protein Wrap',
    desc: 'Lean turkey breast with fresh baby spinach, avocado, and hummus in a high-protein wrap.',
    kcal: 340,
    time: 10,
    protein: '28g',
    carbs: '30g',
    fats: '14g',
    color: '#3AB8E8',
    bg: '#F0F9FF',
    icon: <Bolt size={14} weight="fill" />,
    image: postWorkoutImg,
    ingredients: ['1 whole-wheat wrap', '100g turkey breast', 'Handful of baby spinach', '1/4 avocado', '2 tbsp hummus'],
    steps: ['Spread hummus on the wrap.', 'Layer turkey and spinach.', 'Add avocado slices.', 'Roll tightly.', 'Slice in half and serve.']
  }
]


function getDailyQuote() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - start) / 86400000)
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [mealIndex, setMealIndex] = useState(0)

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const [quote] = useState(() => getDailyQuote())

  useEffect(() => {
    let active = true
    const loadData = async () => {
      setLoading(true)
      try {
        const res = await api.get('/dashboard/today')
        if (active) {
          setStats(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
        if (active) setStats(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [])

  const nextMeals = () => {
    if (mealIndex + 3 < MEAL_SUGGESTIONS.length) {
      setMealIndex(prev => prev + 3)
    } else {
      setMealIndex(0)
    }
  }

  const prevMeals = () => {
    if (mealIndex - 3 >= 0) {
      setMealIndex(prev => prev - 3)
    } else {
      setMealIndex(Math.floor((MEAL_SUGGESTIONS.length - 1) / 3) * 3)
    }
  }

  const visibleMeals = MEAL_SUGGESTIONS.slice(mealIndex, mealIndex + 3)

  const statCards = [
    {
      icon: <Timer size={22} weight="duotone" />,
      val: stats ? `${Math.floor(stats.activeMinutes / 60)}h ${stats.activeMinutes % 60}m` : '—',
      unit: '', label: 'Active Minutes', delta: stats?.activeMinutesDelta, color: 'c1'
    },
    {
      icon: <Fire size={22} weight="duotone" />,
      val: stats?.calories ?? '—',
      unit: 'kcal', label: 'Calories burned', delta: stats?.caloriesDelta, color: 'c2'
    },
    {
      icon: <Drop size={22} weight="duotone" />,
      val: stats ? (Number(stats.water) || 0).toFixed(1) : '—',
      unit: 'L', label: 'Water intake', color: 'c3'
    },
    {
      icon: <Bed size={22} weight="duotone" />,
      val: stats?.sleep ?? '—',
      unit: 'h', label: 'Sleep last night', color: 'c4'
    },
  ]

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>{today}</div>
          <h1 className={styles.pageTitle}>
            {getGreeting()}, <span>{user?.name?.split(' ')[0] || 'there'}</span>{' '}
            <HandWaving size={20} weight="duotone" color="#4A7C6F" />
          </h1>
        </div>
        <div className={styles.topbarRight}>
          <div className={`${styles.streakChip} ${stats?.currentStreak > 0 ? styles.streakActive : ''}`}>
            <Fire size={14} weight="duotone" style={{ color: 'var(--coral)' }} />
            {stats?.currentStreak ?? 0}-day streak
          </div>
        </div>
      </div>

      {/* Quote banner */}
      <div className={styles.quoteBanner}>
        <Leaf size={24} weight="duotone" style={{ color: 'var(--mint)', flexShrink: 0 }} />
        <p className={styles.quoteText}>
          <strong>Daily reminder —</strong> {quote.text}
        </p>
      </div>

      {/* Stat cards */}
      <div className={`${styles.statsRow} ${styles.col4}`}>
        {statCards.map((s, i) => (
          <div key={i} className={`${styles.statCard} ${styles[s.color]}`}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statVal}>{s.val}<sup>{s.unit}</sup></div>
            <div className={styles.statLabel}>{s.label}</div>
            {s.delta && (
              <div className={`${styles.statDelta} ${s.delta > 0 ? 'up' : 'dn'}`}>
                {s.delta > 0 ? '↑' : '↓'} {Math.abs(s.delta)}% vs yesterday
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress & Activities Row */}
      <div className={styles.dashboardGrid}>
        {/* Today's Progress */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Today's progress</span>
          </div>
          <div className={styles.goalsGrid}>
            {[
              { label: 'Active', value: stats?.activeMinutes ?? 0, goal: stats?.activeMinutesGoal ?? 30, color: 'var(--sage)', icon: <Timer size={14} weight="bold" /> },
              { label: 'Cals', value: stats?.calories ?? 0, goal: stats?.caloriesGoal ?? 500, color: 'var(--coral)', icon: <Fire size={14} weight="bold" /> },
              { label: 'Water', value: stats?.water ?? 0, goal: stats?.dailyWaterGoal ?? 2.0, color: 'var(--sky)', icon: <Drop size={14} weight="bold" /> },
              { label: 'Sleep', value: (stats?.sleep ?? 0) * 60, goal: (stats?.sleepGoal ?? 8) * 60, color: 'var(--lav)', icon: <Bed size={14} weight="bold" /> },
            ].map(g => (
              <div key={g.label} className={styles.goalItem}>
                <div className={styles.goalMeta}>
                  <div className={styles.goalLabel}>
                    <span className={styles.goalIcon} style={{ color: g.color }}>{g.icon}</span>
                    {g.label}
                  </div>
                  <span className={styles.goalPct}>
                    {Math.min(Math.round(g.value / g.goal * 100), 100)}%
                  </span>
                </div>
                <div className={styles.goalBar}>
                  <div
                    className={styles.goalFill}
                    style={{
                      width: `${Math.min(g.value / g.goal * 100, 100)}%`,
                      background: g.color,
                      boxShadow: `0 0 10px ${g.color}33`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Activities */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Today's activities</span>
            <span className={styles.panelAction} onClick={() => navigate("/dashboard/activities")}>+ Add</span>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading…</p>
          ) : stats?.workouts?.length ? (
            <div className={styles.workoutList}>
              {stats.workouts.slice(0, 3).map((w, i) => {
                const meta = WORKOUT_ICONS[w.name] ?? WORKOUT_ICONS.Other
                return (
                  <div key={i} className={styles.workoutItem}>
                    <div
                      className={styles.wIcon}
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.icon}
                    </div>
                    <div className={styles.wInfo}>
                      <div className={styles.wName}>{w.name}</div>
                      <div className={styles.wMeta}>{w.duration}m</div>
                    </div>
                    <div className={styles.wCal}>{w.calories}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No workouts logged</p>
          )}
        </div>
      </div>

      {/* Meal suggestions Carousel */}
      <div className={styles.mealSection}>
        <div className={styles.mealHeader}>
          <div className={styles.mealTitle}>
            <CookingPot size={22} weight="duotone" color="var(--sage)" />
            <span>Meal suggestions for today</span>
          </div>
          <div className={styles.carouselControls}>
            <button className={styles.carouselBtn} onClick={prevMeals}>
              <CaretLeft size={18} weight="bold" />
            </button>
            <div className={styles.carouselDots}>
              {[...Array(Math.ceil(MEAL_SUGGESTIONS.length / 3))].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${mealIndex / 3 === i ? styles.dotActive : ''}`}
                  onClick={() => setMealIndex(i * 3)}
                />
              ))}
            </div>
            <button className={styles.carouselBtn} onClick={nextMeals}>
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
        <div className={styles.mealGrid}>
          {visibleMeals.map((m, i) => (
            <div key={mealIndex + i} className={`${styles.mealCard} ${styles.fadeIn}`}>
              <div className={styles.mealImgContainer} onClick={() => setSelectedMeal(m)}>
                <img src={m.image} alt={m.title} className={styles.mealImg} />
                <div className={styles.mealTag} style={{ backgroundColor: m.bg, color: m.color }}>
                  {m.icon} {m.type}
                </div>
              </div>
              <div className={styles.mealContent} onClick={() => setSelectedMeal(m)}>
                <h3 className={styles.mealName}>{m.title}</h3>
                <p className={styles.mealDesc}>{m.desc}</p>
                <div className={styles.mealInfo}>
                  <div className={styles.mealStat}>
                    <Fire size={14} weight="fill" color="var(--coral)" />
                    <span>{m.kcal} kcal</span>
                  </div>
                  <div className={styles.mealStat}>
                    <Timer size={14} weight="fill" color="var(--text3)" />
                    <span>{m.time} min</span>
                  </div>
                  <div className={styles.mealStat}>
                    <Barbell size={14} weight="fill" color="var(--amber)" />
                    <span>{m.protein}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Leaf size={22} weight="fill" color="var(--sage)" />
          <span>iHealthU</span>
        </div>
        <p className={styles.footerCopy}>© 2026 iHealthU. All rights reserved.</p>
        <div className={styles.footerTeam}>
          <span>GHAMMAD Aya</span>
          <span>BENNOUR Rafaa</span>
          <span>RIAD Marwa</span>
          <span>AMANZOU Amal</span>
        </div>
      </footer>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMeal(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setSelectedMeal(null)}>
              <X size={20} weight="bold" />
            </button>
            <div className={styles.modalBody}>
              <div className={styles.modalHero}>
                <img src={selectedMeal.image} alt={selectedMeal.title} className={styles.modalImg} />
                <div className={styles.modalHeroContent}>
                  <div className={styles.modalTag} style={{ backgroundColor: selectedMeal.bg, color: selectedMeal.color }}>
                    {selectedMeal.icon} {selectedMeal.type}
                  </div>
                  <h2 className={styles.modalTitle}>{selectedMeal.title}</h2>
                  <p className={styles.modalDescHero}>{selectedMeal.desc}</p>
                </div>
              </div>

              <div className={styles.modalScrollArea}>
                <div className={styles.modalStatsGrid}>
                  <div className={styles.mStat}>
                    <Fire size={20} weight="fill" color="var(--coral)" />
                    <div className={styles.mStatInfo}>
                      <div className={styles.mStatVal}>{selectedMeal.kcal}</div>
                      <div className={styles.mStatLabel}>Calories</div>
                    </div>
                  </div>
                  <div className={styles.mStat}>
                    <Barbell size={20} weight="fill" color="var(--amber)" />
                    <div className={styles.mStatInfo}>
                      <div className={styles.mStatVal}>{selectedMeal.protein}</div>
                      <div className={styles.mStatLabel}>Protein</div>
                    </div>
                  </div>
                  <div className={styles.mStat}>
                    <Timer size={20} weight="fill" color="var(--sky)" />
                    <div className={styles.mStatInfo}>
                      <div className={styles.mStatVal}>{selectedMeal.time}m</div>
                      <div className={styles.mStatLabel}>Prep time</div>
                    </div>
                  </div>
                </div>

                <div className={styles.modalMainContent}>
                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Ingredients</h4>
                    <ul className={styles.ingredientList}>
                      {selectedMeal.ingredients.map((ing, i) => (
                        <li key={i} className={styles.ingredientItem}>
                          <CheckCircle size={16} weight="fill" color="var(--sage)" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Preparation Steps</h4>
                    <div className={styles.stepsList}>
                      {selectedMeal.steps.map((step, i) => (
                        <div key={i} className={styles.stepItem}>
                          <span className={styles.stepNum}>{i + 1}</span>
                          <p className={styles.stepText}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}