import React, { useState } from 'react';
import API from './api';
import { Sprout, Briefcase, MapPin, UserPlus, Phone, User } from 'lucide-react';

const Login = ({ setRole, setUserId, lang }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        phone_number: '',
        full_name: '',
        role: 'Farmer',
        location_district: 'Hyderabad',
        company_name: ''
    });

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('phone_number', formData.phone_number);
            data.append('role', formData.role);
            data.append('full_name', formData.full_name);
            data.append('location_district', formData.location_district);
            if (formData.role === 'Dealer') {
                data.append('company_name', formData.company_name);
            }

            const res = await API.post('/register', data);
            setUserId(res.data.id);
            setRole(res.data.role);
        } catch (err) {
            alert(err.response?.data?.detail || "Authentication failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sprout className="text-green-700" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        {isRegistering ? "Join Agri-World" : "Farmer & Dealer Login"}
                    </h2>
                    <p className="text-slate-500 text-sm">2026 Sustainable Agriculture Network</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {isRegistering && (
                        <div className="relative">
                            <User className="absolute left-4 top-4 text-slate-400" size={18} />
                            <input 
                                type="text" placeholder="Full Name" required
                                className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                    )}
                    
                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
                        <input 
                            type="tel" placeholder="Phone Number" required
                            className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        />
                    </div>

                    {isRegistering && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'Farmer'})}
                                    className={`flex-1 p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${formData.role === 'Farmer' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-slate-600'}`}
                                >
                                    <Sprout size={18}/> Farmer
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'Dealer'})}
                                    className={`flex-1 p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${formData.role === 'Dealer' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600'}`}
                                >
                                    <Briefcase size={18}/> Dealer
                                </button>
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                <input 
                                    type="text" placeholder="District (e.g., Warangal)" required
                                    className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                                    onChange={(e) => setFormData({...formData, location_district: e.target.value})}
                                />
                            </div>

                            {formData.role === 'Dealer' && (
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-4 text-blue-400" size={18} />
                                    <input 
                                        type="text" placeholder="Company Name (e.g., BSH)" required
                                        className="w-full p-4 pl-12 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <button className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition flex items-center justify-center gap-2">
                        {isRegistering ? <UserPlus size={20}/> : null}
                        {isRegistering ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="w-full mt-6 text-sm font-bold text-green-700 hover:text-green-800 transition"
                >
                    {isRegistering ? "Already have an account? Login" : "New to Agri-World? Register Now"}
                </button>
            </div>
        </div>
    );
};

export default Login;