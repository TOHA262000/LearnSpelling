import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PracticeMode from './pages/PracticeMode/PracticeMode';
import WordManagement from './pages/WordManagement/WordManagement';
import SpellingTest from './pages/SpellingTest/SpellingTest';
import NaVBar from './pages/NavBar/NavBar';
import Footer from './pages/Footer/Footer';

export default function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen flex flex-col text-black">
        <NaVBar />
        {/* This div will take remaining space */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PracticeMode />} />
            <Route path="/words" element={<WordManagement />} />
            <Route path="/test" element={<SpellingTest />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
