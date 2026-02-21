
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sprout, ShoppingCart, Users, LayoutDashboard, Globe } from 'lucide-react';

// Importing your real components
import Dashboard from './Dashboard';
import SocialDoctor from './SocialDoctor';
import Marketplace from './Marketplace';
import Login from './Login';

function App() {
  const [language, setLanguage] = useState('en');
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  

  // Translation Dictionary for Core UI
  const translations = {
    en: {
      brand: "Agri-World",
      dashboard: "Dashboard",
      market: "Marketplace",
      social: "Social Doctor",
      toggle: "తెలుగు"
    },
    te: {
      brand: "అగ్రి-వరల్డ్",
      dashboard: "డాష్‌బోర్డ్",
      market: "మార్కెట్ ప్లేస్",
      social: "సోషల్ డాక్టర్",
      toggle: "English"
    }
  };

  const t = translations[language];
  
  if (!role) {
   return <Login setRole={setRole} setUserId={setUserId} lang={language} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-extrabold text-green-700 flex items-center gap-2">
              <Sprout size={28} /> {t.brand}
            </h1>
            
            <div className="flex items-center gap-6">
              {/* Desktop Links */}
              <div className="hidden md:flex gap-6 text-slate-600 font-semibold">
                <Link to="/" className="hover:text-green-700 transition">{t.dashboard}</Link>
                <Link to="/market" className="hover:text-green-700 transition">{t.market}</Link>
                <Link to="/social" className="hover:text-green-700 transition">{t.social}</Link>
              </div>

              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100 hover:bg-green-100 transition"
              >
                <Globe size={14} /> {t.toggle}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard lang={language} />} />
            <Route path="/market" element={<Marketplace lang={language} />} />
            <Route path="/social" element={<SocialDoctor lang={language} />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 pb-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <Link to="/" className="flex flex-col items-center text-slate-500 hover:text-green-700 transition">
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold mt-1">{t.dashboard}</span>
          </Link>
          <Link to="/market" className="flex flex-col items-center text-slate-500 hover:text-green-700 transition">
            <ShoppingCart size={24} />
            <span className="text-[10px] font-bold mt-1">{t.market}</span>
          </Link>
          <Link to="/social" className="flex flex-col items-center text-slate-500 hover:text-green-700 transition">
            <Users size={24} />
            <span className="text-[10px] font-bold mt-1">{t.social}</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;