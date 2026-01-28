import './App.css'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import RequestPass from './Pages/RequestPass';
import Pass from './Pages/Pass';
import VisitorHistory from './Pages/VisitorHistory';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pass/:passId" element={<Pass />} />
      <Route path="/pass" element={<RequestPass />} />
      <Route path='/history' element={<VisitorHistory />} />
    </Routes>
  );
}

export default App
