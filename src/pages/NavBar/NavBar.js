import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Brand */}
          <div className="text-3xl font-extrabold text-white tracking-wide">
            SpellMaster
          </div>

          {/* Desktop Links */}
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

          {/* Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Open menu"
              className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Practice Mode
            </Link>
            <Link
              to="/words"
              className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Word Management
            </Link>
            <Link
              to="/test"
              className="text-white hover:text-yellow-300 transition duration-300 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Spelling Test
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
