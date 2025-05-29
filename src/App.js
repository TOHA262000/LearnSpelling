import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PracticeMode from './pages/PracticeMode/PracticeMode';
import WordManagement from './pages/WordManagement/WordManagement';
import SpellingTest from './pages/SpellingTest/SpellingTest';


export default function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-gray-100 text-black">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-md">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              {/* Logo / Brand */}
              <div className="text-3xl font-extrabold text-white tracking-wide">
                SpellMaster
              </div>

              {/* Links */}
              <div className="hidden md:flex space-x-12">
                <Link
                  to="/"
                  className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
                >
                  Practice Mode
                </Link>
                <Link
                  to="/words"
                  className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
                >
                  Word Management
                </Link>
                <Link
                  to="/test"
                  className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
                >
                  Spelling Test
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                {/* You can add a hamburger menu icon and logic here later */}
                <button
                  aria-label="Open menu"
                  className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
                >
                  {/* Simple hamburger icon */}
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
