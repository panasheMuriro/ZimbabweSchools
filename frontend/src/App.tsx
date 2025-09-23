import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchoolPage from './pages/SchoolPage';

function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schools/:schoolName" element={<SchoolPage />} />
      </Routes>
    </div>
  );
}

export default App;