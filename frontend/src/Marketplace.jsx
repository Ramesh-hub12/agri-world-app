
import React, { useState, useEffect } from 'react';
import API from './api';
import { Search, MapPin, BadgeCheck, Scale } from 'lucide-react';

const Marketplace = ({ lang }) => {
    const [listings, setListings] = useState([]);
    const [searchCrop, setSearchCrop] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');

    // Dictionary for Marketplace Text
    const uiText = {
        en: {
            title: "Global Marketplace",
            subtitle: "Connecting Telangana farmers to verified buyers",
            searchBtn: "Search",
            cropPlaceholder: "Crop (e.g. Paddy)",
            distPlaceholder: "District",
            organic: "ORGANIC",
            quantity: "Quantity",
            moisture: "Moisture Content",
            priceLabel: "Price per kg",
            contact: "Contact Farmer",
            noData: "No crops listed in this zone yet."
        },
        te: {
            title: "గ్లోబల్ మార్కెట్ ప్లేస్",
            subtitle: "తెలంగాణ రైతులను ధృవీకరించబడిన కొనుగోలుదారులతో అనుసంధానించడం",
            searchBtn: "వెతకండి",
            cropPlaceholder: "పంట (ఉదా: వరి)",
            distPlaceholder: "జిల్లా",
            organic: "సేంద్రియ",
            quantity: "పరిమాణం",
            moisture: "తేమ శాతం",
            priceLabel: "కిలో ధర",
            contact: "రైతును సంప్రదించండి",
            noData: "ఈ జోన్‌లో ఇంకా పంటలు నమోదు కాలేదు."
        }
    };

    const t = uiText[lang];

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        try {
            const res = await API.get(`/marketplace/search`, {
                params: { crop: searchCrop, district: searchDistrict }
            });
            setListings(res.data);
        } catch (err) {
            console.error("Market search failed", err);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
                    <p className="text-slate-500">{t.subtitle}</p>
                </div>
                
                {/* Search Bar */}
                <div className="flex bg-white p-2 rounded-xl shadow-sm border border-slate-200 items-center gap-2">
                    <Search size={18} className="text-slate-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder={t.cropPlaceholder} 
                        className="p-2 outline-none text-sm w-32"
                        value={searchCrop}
                        onChange={(e) => setSearchCrop(e.target.value)}
                    />
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <MapPin size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={t.distPlaceholder} 
                        className="p-2 outline-none text-sm w-32"
                        value={searchDistrict}
                        onChange={(e) => setSearchDistrict(e.target.value)}
                    />
                    <button onClick={handleSearch} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-800 transition">
                        {t.searchBtn}
                    </button>
                </div>
            </header>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.length > 0 ? listings.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-green-200 transition">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-800 uppercase">{item.crop_name}</h3>
                            {item.is_organic && (
                                <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                                    <BadgeCheck size={12} /> {t.organic}
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Scale size={16}/> {t.quantity}</span>
                                <span className="font-bold">{item.quantity} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><MapPin size={16}/> {lang === 'te' ? 'జిల్లా' : 'District'}</span>
                                <span className="font-bold">{item.location_district || "Telangana"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t.moisture}</span>
                                <span className={`font-bold ${item.moisture_content < 14 ? 'text-green-600' : 'text-amber-600'}`}>
                                    {item.moisture_content}%
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400">{t.priceLabel}</p>
                                <p className="text-xl font-black text-green-700">₹{item.price_per_kg}</p>
                            </div>
                            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition">
                                {t.contact}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">
                        {t.noData}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;