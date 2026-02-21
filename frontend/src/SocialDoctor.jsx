import React, { useState, useEffect } from 'react';
import API from './api';
import { Camera, Send, MessageSquare } from 'lucide-react';

const SocialDoctor = () => {
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState('');
    const [cropType, setCropType] = useState('Paddy');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load the community feed on startup
    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            const res = await API.get('/community-feed');
            setPosts(res.data);
        } catch (err) {
            console.error("Error loading feed", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return alert("Please select an image first!");
        setLoading(true);

        const formData = new FormData();
        formData.append('farmer_id', 1); // Using Ramesh's ID (1)
        formData.append('crop_type', cropType);
        formData.append('description', description);
        formData.append('file', image);

        try {
            await API.post('/post-disease', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDescription('');
            setImage(null);
            fetchFeed(); // Refresh the feed
            alert("Posted successfully!");
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Social Doctor</h2>
                <p className="text-slate-500 text-sm">Share photos of crop issues to get community help</p>
            </header>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex gap-4">
                    <select 
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                    >
                        <option>Paddy</option>
                        <option>Cotton</option>
                        <option>Chilli</option>
                    </select>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                </div>
                <textarea 
                    placeholder="Describe the problem (e.g., yellow spots on leaves...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm h-24 focus:ring-2 focus:ring-green-500 outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button 
                    disabled={loading}
                    className="w-full bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-lg shadow-green-100 disabled:opacity-50"
                >
                    {loading ? "Posting..." : <><Send size={18}/> Post to Community</>}
                </button>
            </form>

            {/* Community Feed */}
            <div className="space-y-6">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <MessageSquare size={20}/> Recent Discussions
                </h3>
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        {/* We use the backend URL for the image */}
                        <img src={`http://127.0.0.1:8000/${post.image_url}`} alt="Crop Issue" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md uppercase">{post.crop_type}</span>
                            <p className="mt-2 text-slate-700 text-sm">{post.description}</p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                                <span>Posted by Farmer #{post.author_id}</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialDoctor;