import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './Login';
import Dashboard from './Dashboard';
import RepresentativeView from './RepresentativeView';
import Marketplace from './Marketplace';
import SocialDoctor from './SocialDoctor';
import Inventory from './Inventory';

function App() {
  const [role, setRole] = useState(localStorage.getItem('userRole'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('lang', language);
    } else {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    }
  }, [role, userId, language]);

  if (!role) {
    return <Login setRole={setRole} setUserId={setUserId} lang={language} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar 
          role={role} 
          lang={language} 
          setLanguage={setLanguage} 
          setRole={setRole} 
          setUserId={setUserId} 
        />
        
        <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
          <Routes>
            <Route 
              path="/" 
              element={role === 'Farmer' ? <Dashboard lang={language} userId={userId} /> : <RepresentativeView userId={userId} lang={language} />} 
            />
            <Route path="/market" element={<Marketplace userId={userId} lang={language} />} />
            <Route path="/social" element={<SocialDoctor userId={userId} lang={language} />} />
            <Route path="/inventory" element={<Inventory userId={userId} lang={language} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;