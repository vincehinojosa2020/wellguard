import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="bg-[#C8FF00] text-[#1B1F3B] py-3 px-4 text-center text-[14px] font-medium">
                  <span>Explore the latest open source and AI trends in the 2026 State of the Software Supply Chain report.</span>
                  <a href="#" className="inline-flex items-center ml-2 font-bold hover:underline">
                    Read Now →
                  </a>
                </div>
                <Navbar />
                <LandingPage />
              </div>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
