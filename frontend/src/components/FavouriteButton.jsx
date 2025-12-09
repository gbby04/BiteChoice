import React, { useState, useEffect } from 'react';
import { supabase } from '../db';

export default function FavoriteButton({ restaurantId }) {
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Check if already favorited
    useEffect(() => {
        const checkFav = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('restaurant_id', restaurantId)
                    .single();
                if (data) setIsFav(true);
            }
        };
        checkFav();
    }, [restaurantId]);

    // 2. Toggle Logic
    const toggleFav = async (e) => {
        e.preventDefault(); // Stop click from triggering parent links
        e.stopPropagation();
        
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (isFav) {
            // Remove
            await supabase.from('favorites').delete()
                .eq('user_id', user.id).eq('restaurant_id', restaurantId);
            setIsFav(false);
        } else {
            // Add
            await supabase.from('favorites').insert({
                user_id: user.id,
                restaurant_id: restaurantId
            });
            setIsFav(true);
        }
        setLoading(false);
    };

    return (
        <button 
            onClick={toggleFav} 
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${isFav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-stone-400 hover:text-red-400'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}

