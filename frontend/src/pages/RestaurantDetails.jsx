import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import FavoriteButton from '../components/FavoriteButton';

export default function RestaurantDetails() {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const distance = location.state?.distance 
        ? (location.state.distance / 1000).toFixed(1) + ' km' 
        : 'Nearby'; // Fallback if user refreshed the page directly

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                // 1. Fetch Restaurant Info
                const { data: restData, error: restError } = await supabase
                    .from('restaurants')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (restError) throw restError;
                setRestaurant(restData);

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('user_history').insert({
                        user_id: user.id,
                        restaurant_id: id,
                        visited_at: new Date()
                    });
                }

                // 2. Fetch Reviews for this restaurant
                const { data: reviewData, error: reviewError } = await supabase
                    .from('reviews')
                    .select(`
                        id, 
                        rating, 
                        content, 
                        created_at,
                        profiles ( full_name, avatar_url ) -- Join with profiles to get user info
                    `)
                    .eq('restaurant_id', id)
                    .order('created_at', { ascending: false });

                if (reviewError) throw reviewError;
                setReviews(reviewData || []);

            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-app-bg text-brand-brown">Loading...</div>;
    if (!restaurant) return <div className="flex h-screen items-center justify-center bg-app-bg text-brand-brown">Restaurant not found.</div>;

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col pb-10">
            
            {/* --- HERO IMAGE & BACK BUTTON --- */}
            <div className="relative h-64 w-full">
                <img 
                    src={restaurant.image_url || 'https://via.placeholder.com/400'} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="absolute top-6 right-6">
                    <FavoriteButton restaurantId={restaurant.id} />
                </div>
            </div>

            {/* --- CONTENT CONTAINER --- */}
            <div className="flex-1 px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-stone-50">
                    
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-dark leading-tight">{restaurant.name}</h1>
                            <p className="text-stone-400 text-sm mt-1">{restaurant.cuisine_type} • RM {restaurant.average_price || '15'} / pax</p>
                        </div>
                        <div className="flex flex-col items-center bg-brand-light/20 px-3 py-2 rounded-xl">
                            <span className="text-brand-caramel font-bold text-lg">★ {restaurant.rating || 4.5}</span>
                            <span className="text-xs text-stone-400">{reviews.length} reviews</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-4">
                        {restaurant.is_halal && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Halal</span>
                        )}
                        <span className="px-3 py-1 bg-stone-100 text-stone-500 text-xs font-bold rounded-full">{distance}</span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${restaurant.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}> {restaurant.is_open ? 'Open Now' : 'Closed'}</span>
                    </div>
                    
                    <hr className="my-6 border-stone-100" />

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-dark/20 active:scale-95 transition-transform"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Navigate
                        </a>
                        <Link 
                            to={`/writereview?restaurantId=${restaurant.id}`} // Pass ID to review page
                            className="flex-1 py-3 bg-white border border-stone-200 text-brand-dark font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-50 active:scale-95 transition-transform"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Review
                        </Link>
                    </div>

                    {/* Reviews Section */}
                    <h2 className="text-lg font-bold text-brand-dark mb-4">What people say</h2>
                    
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-stone-400 text-sm italic">No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="bg-stone-50 p-4 rounded-2xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${review.profiles?.full_name || 'User'}&background=random`} 
                                                className="w-8 h-8 rounded-full" 
                                                alt="Avatar"
                                            />
                                            <span className="text-sm font-bold text-brand-dark">{review.profiles?.full_name || 'Anonymous'}</span>
                                        </div>
                                        <div className="text-xs text-brand-caramel font-bold">★ {review.rating}</div>
                                    </div>
                                    <p className="text-sm text-brand-brown leading-relaxed">{review.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}


