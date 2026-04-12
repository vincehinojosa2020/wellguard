import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WellGuardApp from './pages/WellGuardApp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<WellGuardApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
