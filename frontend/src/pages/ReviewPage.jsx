import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../db'; // <--- Import Supabase
// import StarRating from '../components/StarRating'; // <--- Use your component!

export default function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('newest');

    // --- FETCH DATA FROM SUPABASE ---
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            
            // 1. Start the query
            // We select * from reviews AND join 'restaurants' to get the name
            let query = supabase
                .from('reviews')
                .select(`
                    *,
                    restaurants ( name, cuisine_type, image_url )
                `);

            // 2. Apply Sorting
            if (sort === 'newest') {
                query = query.order('created_at', { ascending: false });
            } else if (sort === 'top') {
                query = query.order('rating', { ascending: false });
            } else if (sort === 'lowest') {
                query = query.order('rating', { ascending: true });
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching reviews:", error);
            } else {
                // 3. Client-side Search (Easiest for joined tables)
                // Filter the results based on restaurant name or content
                const filteredData = data.filter(review => 
                    review.restaurants?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    review.content.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setReviews(filteredData);
            }
            setIsLoading(false);
        };

        fetchReviews();
    }, [sort, searchTerm]); // Re-run when sort or search changes


    // --- HELPER: Time Ago ---
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Today";
    };

    // --- HELPER: Render Stars (Or use your component) ---
    const renderStars = (rating) => {
        return (
            <div className="flex text-sm text-brand-caramel">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? "text-brand-caramel" : "text-stone-200"}>★</span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col relative pb-28">

            {/* HEADER AND SEARCH */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <div className="flex justify-between items-center w-full mb-4">
                    <Link to="/home" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-brand-dark">Community Reviews</h1>
                    <div className="w-12"></div> {/* Spacer for alignment */}
                </div>

                {/* Search Bar */}
                <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder="Search for a restaurant..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-4 pl-12 pr-4 bg-white rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 placeholder-stone-400 text-brand-dark"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* FILTER CHIPS */}
            <div className="px-6 flex gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
                {['newest', 'top', 'lowest'].map(option => (
                    <button 
                        key={option}
                        onClick={() => setSort(option)}
                        className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm transition-colors ${sort === option ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20' : 'bg-white text-brand-brown border border-stone-100'}`}
                    >
                        {option === 'newest' ? 'All Reviews' : option === 'top' ? 'Top Rated' : 'Lowest Rated'}
                    </button>
                ))}
            </div>

            {/* REVIEWS LIST */}
            <div className="flex-1 px-6 pb-24 overflow-y-auto hide-scrollbar">
                <div className="space-y-5">
                    {isLoading ? (
                        <div className="flex flex-col items-center pt-10">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-caramel mb-2"></div>
                             <p className="text-stone-400 text-sm">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                         <p className="text-center text-stone-400 pt-10">No reviews found.</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-white p-5 rounded-3xl shadow-sm border border-stone-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* Random Avatar based on ID or fake name */}
                                        <img src={`https://ui-avatars.com/api/?name=User&background=FFE0B2&color=D97706`} alt="User" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-brand-dark text-sm">Student</h3>
                                            <p className="text-xs text-stone-400">{formatTimeAgo(review.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {renderStars(review.rating)}
                                        <span className="text-xs font-bold text-brand-dark">{review.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                
                                {/* Access nested restaurant data safely using '?.' */}
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-brand-caramel uppercase tracking-wide">
                                        {review.restaurants?.cuisine_type || 'Food'}
                                    </span>
                                    <h4 className="text-lg font-bold text-brand-dark">
                                        {review.restaurants?.name || 'Unknown Place'}
                                    </h4>
                                </div>

                                <p className="text-sm text-brand-brown leading-relaxed">
                                    {review.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- BOTTOM NAVIGATION (Ideally extract this to Navbar.jsx) --- */}
            <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 shadow-nav z-40 pb-4 pt-2 bg-white/80 backdrop-blur-md">
                <div class="flex justify-around items-center p-4 max-w-md mx-auto">
                    {/* Home */}
                    <Link to="/home" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </Link>
                    
                    {/* Favourites */}
                    <Link to="/favourites" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </Link>
                    
                    {/* Eating History */}
                    <Link to="/history" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>

                    {/* Review (Active) */}
                    <Link to="/review" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-brand-caramel">
                        <div class="relative p-1"> 
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.35 1.129l-4.243 3.527a.563.563 0 00-.182.557l1.285 5.385a.555.555 0 01-.793.578L12 17.51l-4.708 2.876a.555.555 0 01-.793-.578l1.285-5.385a.563.563 0 00-.182-.557l-4.243-3.527c-.42-.359-.195-1.085.35-1.129l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                            <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-caramel rounded-full"></span>
                        </div>
                    </Link>
                    
                    {/* Profile */}
                    <Link to="/profile" class="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </Link>
                </div>
            </nav>

            {/* Floating Action Button */}
            <Link to="/writereview" className="fixed bottom-24 right-6 z-30 flex items-center gap-2 bg-brand-dark text-white px-6 py-3.5 rounded-full shadow-xl hover:bg-brand-caramel hover:scale-105 transition-all duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
                <span className="font-semibold text-sm">Write Review</span>
            </Link>

        </div>
    );

}
