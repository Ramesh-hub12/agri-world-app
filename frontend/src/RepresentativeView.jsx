import React, { useState, useEffect } from 'react';
import API from './api';
import { Package, BarChart3, AlertTriangle, Building2, TrendingUp, Users } from 'lucide-react';

const RepresentativeView = ({ userId, lang }) => {
    const [profile, setProfile] = useState(null);
    const [stock, setStock] = useState([]);
    const [report, setReport] = useState(null);
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        API.get(`/user/profile/${userId}`).then(res => setProfile(res.data));
        API.get('/rep/inventory').then(res => setStock(res.data));
        API.get('/rep/disease-trends').then(res => setTrends(res.data));
    }, [userId]);

    const handleGenerateReport = async () => {
        try {
            const res = await API.get('/rep/generate-report');
            setReport(res.data);
        } catch (err) {
            console.error("Report generation failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Building2 className="text-blue-700" size={32} />
                        {profile?.company_name || "Company"} Executive Portal
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Representative: <span className="text-slate-800">{profile?.full_name}</span> | Zone: <span className="text-slate-800">{profile?.location_district}</span>
                    </p>
                </div>
                <button 
                    onClick={handleGenerateReport}
                    className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-100"
                >
                    <BarChart3 size={20} /> Generate Business Report
                </button>
            </header>

            {report && (
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-6 text-blue-400">
                        <TrendingUp size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Live Market Intelligence</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Active Farmers</p>
                            <p className="text-3xl font-black">{report.total_active_farmers}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Critical Alert</p>
                            <p className="text-xl font-bold text-red-400">{report.critical_disease_alert}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Inventory</p>
                            <p className="text-xl font-bold text-blue-400">{report.inventory_status}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Market Demand</p>
                            <p className="text-lg font-bold text-green-400">{report.market_demand}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                            <Package className="text-blue-600" /> Warehouse Inventory
                        </h3>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase">Current Stock</span>
                    </div>
                    <div className="space-y-4">
                        {stock.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition">
                                <span className="font-bold text-slate-700">{item.product}</span>
                                <div className="text-right">
                                    <p className="font-black text-blue-700">{item.stock} Units</p>
                                    <p className="text-[10px] text-slate-400 font-bold">₹{item.price}/unit</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                            <AlertTriangle className="text-red-600" /> Regional Health Map
                        </h3>
                        <span className="text-[10px] font-black bg-red-50 text-red-700 px-3 py-1 rounded-full uppercase">Social Doctor Sync</span>
                    </div>
                    <div className="space-y-4">
                        {trends.map(trend => (
                            <div key={trend.id} className="p-4 bg-red-50 rounded-2xl border border-red-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-black text-red-700 uppercase">{trend.district}</p>
                                    <p className="font-bold text-slate-800">{trend.issue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-slate-900">{trend.count}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">REPORTS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepresentativeView;