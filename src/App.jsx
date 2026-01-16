import './App.css'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import RequestPass from './Pages/RequestPass';
import Pass from './Pages/Pass';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pass/:token" element={<Pass />} />
      <Route path="/pass" element={<RequestPass />} />
    </Routes>
  );
}

export default App
