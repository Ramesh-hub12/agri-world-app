import React, { useState, useEffect } from 'react';
import API from './api';
import { Tag, Scale, ShoppingBag, Search, CheckCircle, Info, MapPin } from 'lucide-react';

const Marketplace = ({ userId, lang }) => {
    const [listings, setListings] = useState([]);
    const [formData, setFormData] = useState({
        crop_name: 'Paddy',
        quantity: '',
        price: '',
        is_organic: false
    });
    const [marketTip, setMarketTip] = useState(null);
    const [searchQuery, setSearchQuery] = useState({ crop: '', district: '' });

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await API.get('/marketplace/search', { params: searchQuery });
            setListings(res.data);
        } catch (err) {
            console.error("Failed to fetch listings");
        }
    };

    const checkFairness = async (price) => {
        if (!price || price <= 0) {
            setMarketTip(null);
            return;
        }
        try {
            const res = await API.get(`/market-check/${formData.crop_name}`, {
                params: { current_price: price }
            });
            setMarketTip(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/list-crop', null, {
                params: {
                    farmer_id: userId,
                    crop_name: formData.crop_name,
                    quantity: formData.quantity,
                    price: formData.price,
                    is_organic: formData.is_organic
                }
            });
            alert("Success: Crop listed in the marketplace!");
            setFormData({ crop_name: 'Paddy', quantity: '', price: '', is_organic: false });
            setMarketTip(null);
            fetchListings();
        } catch (err) {
            alert("Error listing crop");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-green-100 p-2 rounded-xl text-green-700">
                        <Tag size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">Sell Your Harvest</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select 
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-slate-700"
                        value={formData.crop_name}
                        onChange={(e) => setFormData({...formData, crop_name: e.target.value})}
                    >
                        <option value="Paddy">Paddy</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Chilli">Chilli</option>
                    </select>

                    <input 
                        type="number" placeholder="Quantity (kg)" required
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    />

                    <div className="relative">
                        <input 
                            type="number" placeholder="Price per kg (₹)" required
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                            value={formData.price}
                            onChange={(e) => {
                                setFormData({...formData, price: e.target.value});
                                checkFairness(e.target.value);
                            }}
                        />
                        {marketTip && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                                <Info size={10} className={marketTip.status === 'Premium' ? 'text-amber-500' : 'text-green-500'} />
                                <p className={`text-[10px] font-black uppercase tracking-tighter ${marketTip.status === 'Premium' ? 'text-amber-600' : 'text-green-600'}`}>
                                    {marketTip.status}: {marketTip.tip}
                                </p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="bg-green-700 text-white font-black rounded-2xl hover:bg-green-800 transition shadow-lg shadow-green-100">
                        Post Listing
                    </button>
                </form>
            </section>

            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="text-blue-600" /> Active Market
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input 
                                type="text" placeholder="Search Crop..." 
                                className="pl-10 p-2 bg-white border border-slate-200 rounded-xl text-sm"
                                onChange={(e) => setSearchQuery({...searchQuery, crop: e.target.value})}
                            />
                        </div>
                        <button onClick={fetchListings} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">Filter</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-widest">
                                        {item.is_organic ? 'Organic' : 'Standard'}
                                    </span>
                                    <h3 className="text-xl font-black text-slate-800 mt-1">{item.crop_name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-green-700">₹{item.price_per_kg}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Per Kilogram</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 py-4 border-t border-slate-50">
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Stock</p>
                                    <p className="font-bold text-slate-700">{item.quantity} kg</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">District</p>
                                    <p className="font-bold text-slate-700 flex items-center gap-1">
                                        <MapPin size={12} className="text-blue-500" /> TS Zone
                                    </p>
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold group-hover:bg-green-700 group-hover:text-white transition-colors">
                                Contact Farmer
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Marketplace;