import React, { useState, useEffect } from 'react';
import API from './api';
import { CloudRain, Sprout, Calendar, AlertCircle, MapPin } from 'lucide-react';

const Dashboard = ({ userId, lang }) => {
    const [profile, setProfile] = useState(null);
    const [advisory, setAdvisory] = useState(null);
    const [crop, setCrop] = useState('Paddy');

    useEffect(() => {
        API.get(`/user/profile/${userId}`).then(res => setProfile(res.data));
        fetchAdvisory('Paddy');
    }, [userId]);

    const fetchAdvisory = async (selectedCrop) => {
        setCrop(selectedCrop);
        try {
            const res = await API.get(`/advisory/${selectedCrop.toLowerCase()}`);
            setAdvisory(res.data);
        } catch (err) {
            console.error("Advisory fetch failed");
        }
    };

    const t = {
        en: { welcome: "Welcome", loc: "Location", alert: "Weather Alert", seed: "Best Seeds for 2026", schedule: "Task Schedule" },
        te: { welcome: "స్వాగతం", loc: "ప్రాంతం", alert: "వాతావరణ హెచ్చరిక", seed: "2026 ఉత్తమ విత్తనాలు", schedule: "పనుల జాబితా" }
    }[lang];

    return (
        <div className="space-y-6">
            <header className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">{t.welcome}, {profile?.full_name}</h2>
                    <p className="text-slate-500 flex items-center gap-1 text-sm font-medium">
                        <MapPin size={14} className="text-green-600" /> {profile?.location_district}, Telangana
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                    {['Paddy', 'Cotton'].map(c => (
                        <button 
                            key={c}
                            onClick={() => fetchAdvisory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${crop === c ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </header>

            {advisory?.weather_alert && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-center gap-4 text-amber-800 animate-pulse">
                    <div className="bg-amber-100 p-2 rounded-full"><CloudRain size={24} /></div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider">{t.alert}</p>
                        <p className="font-bold">{advisory.weather_alert}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Sprout className="text-green-600" /> {t.seed}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {advisory?.data?.best_seeds_2026.map((s, i) => (
                            <div key={i} className="p-3 bg-green-50 rounded-2xl text-green-800 font-bold text-sm">
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> {t.schedule}
                    </h3>
                    <div className="space-y-3">
                        {advisory?.data?.schedule.map((task, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border-b border-slate-50">
                                <span className="text-xs font-black text-slate-400 uppercase">{task.period}</span>
                                <span className="text-sm font-bold text-slate-700">{task.task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-lg">Expert Consultation</h4>
                    <p className="text-blue-300 text-sm">Talk to a Scientist about your {crop} crop.</p>
                </div>
                <button className="bg-white text-blue-900 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition">
                    Call Now
                </button>
            </div>
        </div>
    );
};

export default Dashboard;