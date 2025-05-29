import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PracticeMode from './pages/PracticeMode/PracticeMode';
import WordManagement from './pages/WordManagement/WordManagement';
import SpellingTest from './pages/SpellingTest/SpellingTest';


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Navigation */}
        <nav className="mb-6 space-x-4 text-center">
          <Link to="/" className="text-blue-600 hover:underline">Practice Mode</Link>
          <Link to="/words" className="text-blue-600 hover:underline">Word Management</Link>
          <Link to="/test" className="text-blue-600 hover:underline">Spelling Test</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<PracticeMode />} />
          <Route path="/words" element={<WordManagement />} />
          <Route path="/test" element={<SpellingTest />} />
        </Routes>
      </div>
    </Router>
  );
}
