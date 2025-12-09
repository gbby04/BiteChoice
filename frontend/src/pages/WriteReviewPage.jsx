import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import { supabase } from '../supabaseClient'; 

// --- Utility Data ---
const RATING_TEXTS = [
    "Tap stars to rate",
    "Terrible 😞",
    "Bad 🙁",
    "Okay 😐",
    "Good 🙂",
    "Excellent! 🤩"
];

// --- Star Component ---
const Star = ({ onClick, isFilled }) => (
    <button type="button" onClick={onClick} className="transition-transform hover:scale-110 focus:outline-none">
        <svg 
            className={`w-10 h-10 ${isFilled ? 'text-brand-caramel fill-brand-caramel' : 'text-stone-200 fill-transparent'}`} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    </button>
);

export default function WriteReviewPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    const preSelectedId = searchParams.get('restaurantId'); 
    
    // Form State
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    
    // Search/Dropdown State
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // --- 🟢 NEW: HANDLE URL PARAMETER ---
    // If user comes from the "Are you eating here?" popup, this auto-fills the form
    useEffect(() => {
        if (preSelectedId) {
            setSelectedRestaurantId(preSelectedId);

            // Fetch the specific restaurant name to show in the input box
            const fetchPreSelectedName = async () => {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('name')
                    .eq('id', preSelectedId)
                    .single();
                
                if (data && !error) {
                    setSearchTerm(data.name); // Shows "Burger Lab" instead of blank
                }
            };
            fetchPreSelectedName();
        }
    }, [preSelectedId]);
    // ------------------------------------

    // 1. Fetch Restaurants for the Dropdown Search
    useEffect(() => {
        const fetchRestaurants = async () => {
            const { data } = await supabase
                .from('restaurants')
                .select('id, name, image_url')
                .limit(50); 
            setRestaurantList(data || []);
        };
        fetchRestaurants();
    }, []);

    // Filter restaurants based on input
    const filteredRestaurants = restaurantList.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Validation
        if (!selectedRestaurantId) {
            setMessage({ text: "Please select a restaurant from the list.", isError: true });
            return;
        }
        if (rating === 0) {
            setMessage({ text: "Please select a star rating!", isError: true });
            return;
        }

        setLoading(true);

        try {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // 2. Insert Review
            const { error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    restaurant_id: selectedRestaurantId,
                    rating: rating,
                    content: content,
                    created_at: new Date()
                });

            if (error) throw error;

            setMessage({ text: "Review posted successfully!", isError: false });
            
            // 3. Redirect
            setTimeout(() => navigate('/review'), 1500);

        } catch (err) {
            console.error("Submission error:", err);
            setMessage({ text: "Failed to post review: " + err.message, isError: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col">

            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <Link to="/review" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors group">
                    <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-brand-dark">Write Review</h1>
                <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 pb-10 overflow-y-auto">
                
                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center font-medium ${message.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 mt-4">
                    
                    {/* Restaurant Search Dropdown */}
                    <div className="space-y-3 relative">
                        <label className="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Restaurant Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search & Select Restaurant..." 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    setSelectedRestaurantId(''); // Clear ID if user types again
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full p-5 bg-white rounded-3xl shadow-input text-brand-dark font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 focus:shadow-soft" 
                            />
                            <svg className="w-5 h-5 absolute right-5 top-1/2 transform -translate-y-1/2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Dropdown Results */}
                        {showDropdown && searchTerm && !selectedRestaurantId && (
                            <div className="absolute w-full bg-white mt-2 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto border border-stone-100">
                                {filteredRestaurants.length > 0 ? (
                                    filteredRestaurants.map(r => (
                                        <div 
                                            key={r.id} 
                                            onClick={() => {
                                                setSearchTerm(r.name);
                                                setSelectedRestaurantId(r.id);
                                                setShowDropdown(false);
                                            }}
                                            className="p-4 hover:bg-brand-light/20 cursor-pointer border-b border-stone-50 last:border-0 flex items-center gap-3"
                                        >
                                            <img src={r.image_url || 'https://via.placeholder.com/50'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-medium text-brand-dark">{r.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-stone-400 text-sm text-center">No restaurant found.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Star Rating Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Your Rating</label>
                        <div className="bg-white p-6 rounded-3xl shadow-input flex flex-col items-center justify-center gap-2">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star 
                                        key={i} 
                                        onClick={() => handleRatingChange(i)} 
                                        isFilled={i <= rating}
                                    />
                                ))}
                            </div>
                            <p className={`text-sm font-semibold mt-1 ${rating > 0 ? 'text-brand-caramel' : 'text-stone-400'}`}>
                                {RATING_TEXTS[rating]}
                            </p>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Review</label>
                        <textarea 
                            required 
                            rows="6" 
                            placeholder="Share your experience... (e.g., The food was amazing but the service was a bit slow.)" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-5 bg-white rounded-3xl shadow-input text-brand-dark font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 focus:shadow-soft resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full py-4 rounded-3xl shadow-lg font-bold text-lg transition-all 
                        ${loading 
                            ? 'bg-gray-500 text-white cursor-not-allowed' 
                            : 'bg-brand-dark text-white shadow-brand-dark/20 hover:bg-brand-caramel hover:scale-[1.02] active:scale-95'}`}
                    >
                        {loading ? 'Posting...' : 'Post Review'}
                    </button>
                    
                    <div className="h-4"></div>

                </form>
            </div>

        </div>
    );
}
