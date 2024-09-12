import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OwnerDashboard from './pages/OwnerDashboard';
import TesterDashboard from './pages/TesterDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/tester-dashboard" element={<TesterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
