"use client";

import { useState, useEffect } from 'react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className={`
          w-11/12 max-w-6xl mx-auto
          px-6 py-3 rounded-full
          ${isDarkMode ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'}
          shadow-lg transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMjEuMjUgNy44ODlWNS44MzNhMy4wODMgMy4wODMgMCAwIDAtMy4wODMtMy4wODNoLTMuMDg0bTAgMTguNWgzLjA4NGEzLjA4MyAzLjA4MyAwIDAgMCAzLjA4My0zLjA4M1YxNi4xMW0tMTguNS4wMDF2Mi4wNTZhMy4wODMgMy4wODMgMCAwIDAgMy4wODMgMy4wODNoMy4wODRtMC0xOC41SDUuODMzQTMuMDgzIDMuMDgzIDAgMCAwIDIuNzUgNS44MzNWNy44OW0xMC4xMDktMy41NTdsLTYuNDc2IDguNzZhLjU3LjU3IDAgMCAwLS4wOTguMjI4YS41MTQuNTE0IDAgMCAwIDAgLjI1M2EuNDY1LjQ2NSAwIDAgMCAuMTU1LjE5NmEuNDA4LjQwOCAwIDAgMCAuMjIuMDY1aDQuODk0bC0uNzQyIDUuNzFhLjE3MS4xNzEgMCAwIDAgMCAuMTA1YS4xNjMuMTYzIDAgMCAwIC4wNzMuMDc0YS4xMzkuMTM5IDAgMCAwIC4wOTggMGEuMTI4LjEyOCAwIDAgMCAuMDktLjA1N2w2LjQ3NS04Ljc2YS41NjIuNTYyIDAgMCAwIC4wOTgtLjIzNmEuNDk2LjQ5NiAwIDAgMC0uMTk1LS40NGEuNDA4LjQwOCAwIDAgMC0uMjItLjA2NmgtNC44OTRsLjc0Mi01LjcxYS4xNzEuMTcxIDAgMCAwIDAtLjEwNWEuMTYzLjE2MyAwIDAgMC0uMDc0LS4wNzRhLjEzOS4xMzkgMCAwIDAtLjA5NyAwYS4xMy4xMyAwIDAgMC0uMDUuMDU3Ii8+PC9zdmc+" alt="Logo" className="w-8 h-8" />
              <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Infography</span>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Affiliates</a></li>
                <li><a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Changelog</a></li>
              </ul>
            </nav>
            <button className={`
              px-4 py-2 rounded-full text-white
              ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#14162e] hover:bg-opacity-90'}
              transition duration-300
            `}>
              Try for free →
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}