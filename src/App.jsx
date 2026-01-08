import './App.css'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import Pass from './Pages/Pass';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pass/:token" element={<Pass />} />
    </Routes>
  );
}

export default App
