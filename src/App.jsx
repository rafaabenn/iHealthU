import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import WorkoutsPage from './pages/WorkoutsPage';
import BmiPage from './pages/BmiPage';
import GoalsPage from './pages/GoalsPage';
import WaterPage from './pages/WaterPage';
import MoodPage from './pages/MoodPage';
import CaloriesPage from './pages/CaloriesPage';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.querySelector('.main').scrollTop = 0;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <main className="main">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/bmi" element={<BmiPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/calories" element={<CaloriesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}