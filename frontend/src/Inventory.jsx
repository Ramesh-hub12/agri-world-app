import React, { useState, useEffect } from 'react';
import API from './api';
import { Package, Plus, AlertCircle, ShoppingCart, Archive, Trash2 } from 'lucide-react';

const Inventory = ({ userId, lang }) => {
    const [items, setItems] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [newItem, setNewItem] = useState({
        item_name: '',
        category: 'Fertilizer',
        quantity: '',
        unit: 'kg'
    });

    useEffect(() => {
        fetchInventory();
    }, [userId]);

    const fetchInventory = async () => {
        try {
            const res = await API.get(`/inventory/${userId}`);
            setItems(res.data.inventory);
            setAlerts(res.data.alerts);
        } catch (err) {
            console.error("Failed to load inventory");
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        try {
            await API.post('/add-resource', null, {
                params: {
                    farmer_id: userId,
                    item_name: newItem.item_name,
                    category: newItem.category,
                    quantity: newItem.quantity,
                    unit: newItem.unit
                }
            });
            setNewItem({ item_name: '', category: 'Fertilizer', quantity: '', unit: 'kg' });
            fetchInventory();
        } catch (err) {
            alert("Error adding resource");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                        <Plus size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Add New Stock</h2>
                </div>

                <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input 
                        type="text" placeholder="Item Name" required
                        className="lg:col-span-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
                    />
                    <select 
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600"
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    >
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Pesticide">Pesticide</option>
                    </select>
                    <input 
                        type="number" placeholder="Qty" required
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    />
                    <button type="submit" className="bg-blue-700 text-white font-black rounded-2xl hover:bg-blue-800 transition">
                        Add
                    </button>
                </form>
            </section>

            {alerts.length > 0 && (
                <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-3xl space-y-2">
                    <h3 className="flex items-center gap-2 font-black text-red-700 uppercase text-xs">
                        <AlertCircle size={16} /> Critical Shortage Warnings
                    </h3>
                    {alerts.map((alert, i) => (
                        <p key={i} className="text-red-600 font-bold text-sm">⚠️ {alert}</p>
                    ))}
                </div>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md ${item.stock_remaining < 5 ? 'border-red-100' : ''}`}>
                        <div className={`p-4 rounded-2xl ${item.category === 'Seeds' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            <Archive size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase">{item.category}</p>
                            <h4 className="text-lg font-black text-slate-800">{item.item_name}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`text-xl font-black ${item.stock_remaining < 5 ? 'text-red-600' : 'text-slate-900'}`}>
                                    {item.stock_remaining} <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                                </span>
                                {item.stock_remaining < 5 && (
                                    <button className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1">
                                        <ShoppingCart size={10} /> REORDER
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="md:col-span-2 py-12 text-center text-slate-400">
                        <Package size={48} className="mx-auto mb-2 opacity-20" />
                        <p className="font-bold">No resources logged in inventory.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Inventory;