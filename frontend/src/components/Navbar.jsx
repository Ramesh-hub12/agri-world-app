import React from 'react';
import { LogOut, User, Globe, Sprout, Briefcase } from 'lucide-react';

const Navbar = ({ role, lang, setLanguage, setRole, setUserId }) => {
    
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('lang');
        setRole(null);
        setUserId(null);
    };

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-700 font-black text-xl">
                    <Sprout className="text-green-600" />
                    Agri-World <span className="text-[10px] bg-green-100 px-2 py-0.5 rounded-full">2026</span>
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setLanguage(lang === 'en' ? 'te' : 'en')}
                        className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-green-700 transition"
                    >
                        <Globe size={16} />
                        {lang === 'en' ? 'తెలుగు' : 'English'}
                    </button>

                    <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                                {role === 'Dealer' ? 'Company Rep' : 'Farmer'}
                            </p>
                            <p className="text-sm font-black text-slate-800 leading-tight">
                                {role === 'Dealer' ? 'BSH Portal' : 'My Farm'}
                            </p>
                        </div>
                        
                        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                            {role === 'Dealer' ? <Briefcase size={20} /> : <User size={20} />}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;