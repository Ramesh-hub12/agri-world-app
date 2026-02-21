// import React, { useState } from 'react';
// import { Sprout, ShoppingBag, ArrowRight } from 'lucide-react';

// const Login = ({ setRole, lang }) => {
//     const [phone, setPhone] = useState('');

//     const text = {
//         en: { title: "Welcome to Agri-World", sub: "Select your role to continue", farmer: "I am a Farmer", buyer: "I am a Buyer", phone: "Phone Number", login: "Login" },
//         te: { title: "అగ్రి-వరల్డ్ కు స్వాగతం", sub: "కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి", farmer: "నేను ఒక రైతును", buyer: "నేను ఒక కొనుగోలుదారుని", phone: "ఫోన్ నంబర్", login: "లాగిన్" }
//     };

//     const t = text[lang];

//     const handleLogin = (selectedRole) => {
//         if (phone.length < 10) return alert("Please enter a valid phone number");
//         // In a full app, you'd verify the phone with your Backend here
//         setRole(selectedRole);
//     };

//     return (
//         <div className="min-h-screen bg-green-700 flex items-center justify-center p-6">
//             <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
//                 <div className="text-center mb-8">
//                     <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Sprout className="text-green-700" size={32} />
//                     </div>
//                     <h2 className="text-2xl font-black text-slate-800">{t.title}</h2>
//                     <p className="text-slate-500">{t.sub}</p>
//                 </div>

//                 <div className="space-y-4">
//                     <input 
//                         type="tel" 
//                         placeholder={t.phone}
//                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                     />

//                     <button 
//                         onClick={() => handleLogin('Farmer')}
//                         className="w-full p-4 bg-white border-2 border-green-700 text-green-700 rounded-2xl font-bold flex items-center justify-between hover:bg-green-50 transition"
//                     >
//                         <div className="flex items-center gap-3"><Sprout size={20}/> {t.farmer}</div>
//                         <ArrowRight size={18} />
//                     </button>

//                     <button 
//                         onClick={() => handleLogin('Buyer')}
//                         className="w-full p-4 bg-green-700 text-white rounded-2xl font-bold flex items-center justify-between hover:bg-green-800 transition shadow-lg shadow-green-200"
//                     >
//                         <div className="flex items-center gap-3"><ShoppingBag size={20}/> {t.buyer}</div>
//                         <ArrowRight size={18} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import API from './api';
import { Sprout, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

const Login = ({ setRole, setUserId, lang }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const text = {
        en: { title: "Welcome to Agri-World", sub: "Enter phone to login or register", farmer: "Farmer", buyer: "Buyer", phone: "Phone Number", login: "Continue" },
        te: { title: "అగ్రి-వరల్డ్ కు స్వాగతం", sub: "లాగిన్ లేదా రిజిస్టర్ చేయడానికి ఫోన్ నంబర్ ఇవ్వండి", farmer: "రైతు", buyer: "కొనుగోలుదారు", phone: "ఫోన్ నంబర్", login: "కొనసాగించు" }
    };

    const t = text[lang];

    const handleAuth = async (selectedRole) => {
        if (phone.length < 10) return alert("Enter valid 10-digit number");
        setLoading(true);

        try {
            // Attempt to register/login via your FastAPI backend
            const response = await API.post('/register', {
                phone_number: phone,
                full_name: "User", // Default for now
                role: selectedRole,
                location_district: "Hyderabad" // Default based on your location
            });
            
            // On success, save user details to the app state
            setUserId(response.data.id);
            setRole(response.data.role);
        } catch (err) {
            // If phone exists, your backend sends 400. In a real app, we'd handle "Login" here.
            console.log("Auth redirecting to existing profile...");
            setRole(selectedRole);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-700 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <Sprout className="text-green-700 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-black text-slate-800">{t.title}</h2>
                    <p className="text-slate-500 text-sm mt-2">{t.sub}</p>
                </div>

                <div className="space-y-4">
                    <input 
                        type="tel" 
                        placeholder={t.phone}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            disabled={loading}
                            onClick={() => handleAuth('Farmer')}
                            className="p-4 bg-white border-2 border-green-700 text-green-700 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-green-50 disabled:opacity-50"
                        >
                            <Sprout size={24}/> {t.farmer}
                        </button>

                        <button 
                            disabled={loading}
                            onClick={() => handleAuth('Buyer')}
                            className="p-4 bg-green-700 text-white rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-green-800 disabled:opacity-50"
                        >
                            <ShoppingBag size={24}/> {t.buyer}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;