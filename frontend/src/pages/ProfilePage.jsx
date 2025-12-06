import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

export default function ProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: 'Student',
        email: '',
        avatar: '',
        level: 'Basic'
    });
    const [stats, setStats] = useState({
        reviews: 0,
        favorites: 0
    });
    const [recentReviews, setRecentReviews] = useState([]);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                // 1. Get Current User
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    navigate('/login'); // Redirect if not logged in
                    return;
                }

                // 2. Fetch Profile Info (from the table we just made)
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', user.id)
                    .single();

                // 3. Fetch Counts (Reviews & Favorites)
                // We use { count: 'exact', head: true } to just get the number, not the data
                const { count: reviewCount } = await supabase
                    .from('reviews')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const { count: favCount } = await supabase
                    .from('favorites')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                // 4. Fetch Recent Reviews (Limit 2)
                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select(`
                        id,
                        rating,
                        content,
                        created_at,
                        restaurants ( name, image_url )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(2);

                // 5. Update State
                setProfile({
                    name: profileData?.full_name || user.email.split('@')[0],
                    email: user.email,
                    avatar: profileData?.avatar_url,
                    level: reviewCount > 10 ? 'Gold' : reviewCount > 5 ? 'Silver' : 'Basic'
                });
                
                setStats({
                    reviews: reviewCount || 0,
                    favorites: favCount || 0
                });

                setRecentReviews(reviewsData || []);

            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        getProfileData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/'); // Go back to Login/Welcome page
    };

    // Helper for "2 days ago"
    const timeAgo = (dateStr) => {
        const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        return days === 0 ? "Today" : `${days} days ago`;
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-app-bg text-brand-brown">Loading Profile...</div>;
    }

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col pb-28">

            {/* --- HEADER --- */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <Link to="/home" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold text-brand-dark">My Profile</h1>
                <div className="w-12"></div> 
            </div>

            <div className="flex-1 px-6 pb-10 overflow-y-auto hide-scrollbar">
                
                {/* --- PROFILE INFO --- */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full p-1 bg-white shadow-soft">
                            {/* Fallback to UI Avatars if no image uploaded */}
                            <img 
                                src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=D97706&color=fff&size=200`} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-full" 
                            />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-brand-dark capitalize">{profile.name}</h2>
                    <p className="text-brand-brown text-sm mb-4">{profile.email}</p>

                    {/* Stats Row */}
                    <div className="flex space-x-8 mb-6">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-brand-caramel">{stats.reviews}</span>
                            <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Reviews</span>
                        </div>
                        <div className="w-px bg-stone-200"></div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-brand-caramel">{stats.favorites}</span>
                            <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Favorites</span>
                        </div>
                        <div className="w-px bg-stone-200"></div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-stone-500">{profile.level}</span>
                            <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Level</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full space-x-3">
                        <Link to="/edit-profile" className="flex-1 py-3 bg-brand-dark text-white font-semibold rounded-2xl shadow-lg shadow-brand-dark/20 active:scale-95 transition-transform flex justify-center items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </Link>

                        <Link to="/settings" className="flex-1 py-3 bg-white text-brand-dark border border-stone-100 font-semibold rounded-2xl shadow-sm active:scale-95 transition-transform flex justify-center items-center gap-2 hover:bg-stone-50">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </Link>
                    </div>
                </div>

                {/* --- MY REVIEWS SECTION --- */}
                <section className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold text-brand-dark">My Reviews</h2>
                        <Link to="/review" className="text-sm text-brand-brown">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {recentReviews.length === 0 ? (
                            <div className="text-center text-stone-400 py-4">You haven't written any reviews yet.</div>
                        ) : (
                            recentReviews.map(review => (
                                <div key={review.id} className="bg-white p-4 rounded-3xl shadow-sm border border-stone-50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={review.restaurants?.image_url || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-xl object-cover" alt="Restaurant" />
                                        <div>
                                            <h3 className="font-bold text-brand-dark text-sm">{review.restaurants?.name || 'Unknown'}</h3>
                                            <div className="flex items-center text-xs text-stone-400">
                                                <span>{timeAgo(review.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end">
                                            <div className="flex text-brand-caramel text-sm">
                                                 {/* Simple star logic */}
                                                 ★ {review.rating}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-brand-brown leading-relaxed mb-3 line-clamp-2">
                                        {review.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* --- MENU OPTIONS --- */}
                <div className="bg-white rounded-3xl p-2 mb-8 shadow-sm">
                    <Link to="/premium" className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-light/50 rounded-full text-brand-caramel">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <span className="font-medium text-brand-dark">Premium Plan</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </Link>

                    <Link to="/notifications" className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-light/50 rounded-full text-brand-caramel">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </div>
                            <span className="font-medium text-brand-dark">Notifications</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </Link>

                    <Link to="/support" className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-light/50 rounded-full text-brand-caramel">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <span className="font-medium text-brand-dark">Support & Help</span>
                        </div>
                        <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </Link>
                </div>

                {/* --- LOG OUT BUTTON --- */}
                <button 
                    onClick={handleLogout}
                    className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                </button>
            </div>

            {/* --- BOTTOM NAVIGATION --- */}
            <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 shadow-nav z-40 pb-4 pt-2" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <div className="flex justify-around items-center p-2 max-w-md mx-auto">
                    {/* Home */}
                    <Link to="/home" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                    </Link>
                    
                    {/* Favourites */}
                    <Link to="/favourites" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </Link>
                    
                    {/* Eating History */}
                    <Link to="/history" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>

                    {/* Review */}
                    <Link to="/review" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.35 1.129l-4.243 3.527a.563.563 0 00-.182.557l1.285 5.385a.555.555 0 01-.793.578L12 17.51l-4.708 2.876a.555.555 0 01-.793-.578l1.285-5.385a.563.563 0 00-.182-.557l-4.243-3.527c-.42-.359-.195-1.085.35-1.129l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    </Link>

                    {/* Profile (Active) */}
                    <Link to="/profile" className="flex flex-col items-center gap-1 w-1/5 text-brand-caramel">
                        <div className="relative p-1">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-caramel rounded-full"></span>
                        </div>
                    </Link>
                </div>
            </nav>

        </div>
    );
}