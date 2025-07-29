import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="app">
      {currentView === 'landing' ? (
        <LandingPage onNavigateToDashboard={handleNavigateToDashboard} />
      ) : (
        <Dashboard onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;