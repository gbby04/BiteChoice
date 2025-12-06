import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

// --- Icons Components ---
const IconHeart = ({ stroke = true }) => (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" stroke={stroke ? "currentColor" : "none"}>
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const IconStar = () => (
    <svg className="w-3.5 h-3.5 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
);

export default function FavouritePage() {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemoving, setIsRemoving] = useState({}); 

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // 1. Get User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Handle not logged in

                // 2. Fetch Favorites AND the Restaurant details
                // syntax: select(`restaurant_id, restaurants ( * )`)
                const { data, error } = await supabase
                    .from('favorites')
                    .select(`
                        restaurant_id,
                        restaurants (
                            id,
                            name,
                            cuisine_type,
                            average_price,
                            rating,
                            image_url
                        )
                    `)
                    .eq('user_id', user.id);

                if (error) throw error;

                // 3. Transform Data to match your UI structure
                // Supabase returns nested object: { restaurants: { name: '...' } }
                // We want flat object: { name: '...' }
                const formattedData = data.map(item => ({
                    id: item.restaurants.id, // Use Restaurant ID
                    name: item.restaurants.name,
                    type: item.restaurants.cuisine_type,
                    rating: item.restaurants.rating || '4.5',
                    image: item.restaurants.image_url || 'https://via.placeholder.com/150',
                    dist: 'Nearby' // Favorites query doesn't calc distance cheaply, using static text
                }));

                setFavorites(formattedData); 

            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFavorites();
    }, []);


    // --- UNLIKE Logic with Animation & DB Update ---
    const handleUnlike = async (restaurantId) => {
        // 1. Trigger Animation first (UI feels instant)
        setIsRemoving(prev => ({ ...prev, [restaurantId]: true }));

        try {
            // 2. Get User
            const { data: { user } } = await supabase.auth.getUser();

            // 3. Delete from Supabase
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('restaurant_id', restaurantId);

            if (error) throw error;

            // 4. Update UI State after animation
            setTimeout(() => {
                setFavorites(prev => prev.filter(item => item.id !== restaurantId));
                setIsRemoving(prev => {
                    const newState = { ...prev };
                    delete newState[restaurantId];
                    return newState;
                });
            }, 400); 

        } catch (error) {
            console.error("Error removing favorite:", error);
            // Optional: Revert animation if error occurs
            setIsRemoving(prev => {
                const newState = { ...prev };
                delete newState[restaurantId];
                return newState;
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-app-bg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-caramel"></div>
            </div>
        );
    }

    const favoritesCount = favorites.length;
    const isListEmpty = favoritesCount === 0;

    return (
        <div className="bg-app-bg text-brand-dark antialiased pb-28 min-h-screen">

            {/* --- HEADER --- */}
            <div className="px-6 pt-8 pb-4 sticky top-0 bg-app-bg/95 backdrop-blur-sm z-30">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/home" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-brand-dark">My Favourites</h1>
                    
                    <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-brown">
                        <span className="font-bold text-sm">{favoritesCount}</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="px-6 min-h-[60vh]">
                
                {/* Empty State */}
                <div id="empty-state" className={`flex-col items-center justify-center mt-20 text-center opacity-60 ${isListEmpty ? 'flex' : 'hidden'}`}>
                    <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                        <IconHeart stroke={false} />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark">No favorites yet</h3>
                    <p className="text-sm text-brand-brown">Start exploring and like some places!</p>
                </div>

                {/* Favorites List */}
                <div id="favorites-list" className="space-y-4">
                    {favorites.map(item => (
                        <div 
                            key={item.id}
                            className={`relative flex items-center bg-white p-3 rounded-3xl shadow-sm border border-stone-50 transition-all duration-300 ${isRemoving[item.id] ? 'animate-[fade-out_0.4s_ease-out_forwards]' : ''}`}
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="ml-4 flex-1 pr-10">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-brand-dark text-lg leading-tight mb-1">{item.name}</h3>
                                    <p className="text-sm text-stone-400 mb-2">{item.type} • {item.dist}</p>
                                    
                                    <div className="flex items-center text-brand-caramel font-bold text-sm">
                                        <span className="bg-brand-light/30 px-2 py-0.5 rounded-md flex items-center">
                                            <IconStar />
                                            {item.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Unlike Button */}
                            <button onClick={() => handleUnlike(item.id)} className="absolute top-4 right-4 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors active:scale-90">
                                <IconHeart stroke={false} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM NAVIGATION --- */}
            <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 shadow-nav z-40 pb-4 pt-2" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <div className="flex justify-around items-center p-2 max-w-md mx-auto">
                    {/* Home */}
                    <Link to="/home" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                    </Link>
                    
                    {/* Favourites (Active) */}
                    <Link to="/favourites" className="flex flex-col items-center gap-1 w-1/5 text-brand-caramel">
                        <div className="relative p-1">
                            <IconHeart stroke={false} />
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-caramel rounded-full"></span>
                        </div>
                    </Link>
                    
                    {/* Eating History */}
                    <Link to="/history" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>

                    {/* Review */}
                    <Link to="/review" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.35 1.129l-4.243 3.527a.563.563 0 00-.182.557l1.285 5.385a.555.555 0 01-.793.578L12 17.51l-4.708 2.876a.555.555 0 01-.793-.578l1.285-5.385a.563.563 0 00-.182-.557l-4.243-3.527c-.42-.359-.195-1.085.35-1.129l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    </Link>

                    {/* Profile */}
                    <Link to="/profile" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </Link>
                </div>
            </nav>
        </div>
    );
}