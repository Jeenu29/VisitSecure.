import './App.css'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import RequestPass from './Pages/RequestPass';
import Pass from './Pages/Pass';
import VisitorHistory from './Pages/VisitorHistory';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/pass/:passId" element={<ProtectedRoute><Pass /></ProtectedRoute>} />
      <Route path="/pass" element={<RequestPass />} />
      <Route path='/history' element={<ProtectedRoute><VisitorHistory /></ProtectedRoute>} />
    </Routes>
  );
}

export default App
