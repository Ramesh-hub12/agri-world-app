
import React, { useState, useEffect } from 'react';
import API from './api';
import { CloudRain, Info, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = ({ lang }) => {
    const [advisory, setAdvisory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dictionary for UI Text
    const uiText = {
        en: {
            title: "Farmer Dashboard",
            subtitle: "Personalized data for Ramesh | Warangal Zone",
            loading: "Loading your farm data...",
            seeds: "Best Seeds for 2026",
            timeline: "Fertilizer Timeline"
        },
        te: {
            title: "రైతు డాష్‌బోర్డ్",
            subtitle: "రమేష్ కోసం వ్యక్తిగతీకరించిన డేటా | వరంగల్ జోన్",
            loading: "మీ ఫామ్ డేటా లోడ్ అవుతోంది...",
            seeds: "2026 ఉత్తమ విత్తనాలు",
            timeline: "ఎరువుల కాలక్రమం"
        }
    };

    const t = uiText[lang];

    useEffect(() => {
        API.get('/advisory/paddy')
            .then(res => {
                setAdvisory(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching advisory", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">{t.loading}</div>;

    return (
        <div className="p-4 md:p-8 space-y-6">
            <header>
                <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
                <p className="text-slate-500">{t.subtitle}</p>
            </header>

            {/* Weather Alert Card */}
            {advisory?.weather_alert && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex gap-3 items-center">
                    <CloudRain className="text-amber-600" />
                    <p className="text-amber-800 font-medium">
                        {lang === 'te' ? "⚠️ హెచ్చరిక: భారీ వర్షం సూచన ఉంది. ఎరువుల వాడకాన్ని వాయిదా వేయండి." : advisory.weather_alert}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seed Recommendations */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-4">
                        <TrendingUp size={20} /> {t.seeds}
                    </h3>
                    <ul className="space-y-3">
                        {advisory?.data?.best_seeds_2026.map((seed, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle size={16} className="text-green-500" /> {seed}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Fertilizer Schedule */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-4">
                        <Info size={20} /> {t.timeline}
                    </h3>
                    <div className="space-y-4">
                        {advisory?.data?.schedule.map((task, index) => (
                            <div key={index} className="border-l-2 border-blue-100 pl-4 relative">
                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                                <p className="text-sm font-bold text-slate-800">
                                    {lang === 'te' ? (task.period === "Basal" ? "ప్రారంభ దశ" : task.period === "Tillering" ? "పిలక దశ" : "వెన్ను దశ") : task.period}
                                </p>
                                <p className="text-sm text-slate-600">{task.task}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;