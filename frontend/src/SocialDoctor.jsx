import React, { useState, useEffect } from 'react';
import API from './api';
import { Camera, Send, MapPin, AlertCircle, MessageSquare, Image as ImageIcon } from 'lucide-react';

const SocialDoctor = ({ userId, lang }) => {
    const [posts, setPosts] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [cropType, setCropType] = useState('Paddy');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await API.get('/community-feed');
            setPosts(res.data);
        } catch (err) {
            console.error("Failed to load community feed");
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a photo of the crop issue.");

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('farmer_id', userId);
        formData.append('crop_type', cropType);
        formData.append('description', description);

        try {
            await API.post('/post-disease', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setDescription('');
            fetchPosts();
        } catch (err) {
            alert("Upload failed. Check backend connection.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-red-100 p-2 rounded-xl text-red-600">
                        <Camera size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Report a Disease</h2>
                </div>

                <form onSubmit={handlePost} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700"
                            value={cropType}
                            onChange={(e) => setCropType(e.target.value)}
                        >
                            <option value="Paddy">Paddy</option>
                            <option value="Cotton">Cotton</option>
                            <option value="Chilli">Chilli</option>
                        </select>
                        
                        <label className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-2xl border border-dashed border-blue-200 cursor-pointer hover:bg-blue-100 transition">
                            <ImageIcon size={20} />
                            <span className="text-sm font-bold">{file ? "Photo Selected" : "Upload Photo"}</span>
                            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                        </label>
                    </div>

                    <textarea 
                        placeholder="Describe the symptoms (e.g., Yellow spots on edges)..."
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <button 
                        disabled={uploading}
                        className={`w-full p-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-lg transition ${uploading ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
                    >
                        <Send size={18} /> {uploading ? "Uploading..." : "Share with Community"}
                    </button>
                </form>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 px-2">
                    <MessageSquare className="text-blue-600" size={20} /> Community Insights
                </h2>
                
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 h-48 md:h-auto">
                                    <img 
                                        src={`http://127.0.0.1:8000/${post.image_url}`} 
                                        alt="Disease" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Crop+Image'}
                                    />
                                </div>
                                <div className="p-6 md:w-2/3 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-1 rounded-md uppercase">
                                                {post.crop_type} Alert
                                            </span>
                                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <AlertCircle size={18} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        "{post.description}"
                                    </p>
                                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <MapPin size={12} /> Telangana Zone
                                        </span>
                                        <button className="text-xs font-black text-blue-700 hover:underline">Help Farmer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SocialDoctor;