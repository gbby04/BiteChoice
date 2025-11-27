import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3000"; 
const SUBMIT_REVIEW_ENDPOINT = `${API_URL}/reviews`;

// --- Utility Data ---
const RATING_TEXTS = [
    "Tap stars to rate",
    "Terrible 😞",
    "Bad 🙁",
    "Okay 😐",
    "Good 🙂",
    "Excellent! 🤩"
];

// --- Component for a single Star ---
// This uses the path data from your HTML's SVG
const Star = ({ onClick, isFilled }) => (
    <button type="button" onClick={onClick} className="star-btn transition-transform hover:scale-110 focus:outline-none">
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
    const [restaurantName, setRestaurantName] = useState('');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        setMessage(''); // Clear message on new interaction
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (rating === 0) {
            setMessage({ text: "Please select a star rating!", isError: true });
            return;
        }

        setLoading(true);

        try {
            // Note: In a real app, you must send the JWT token in the headers
            const response = await fetch(SUBMIT_REVIEW_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurant_name: restaurantName,
                    rating: rating,
                    content: content,
                    // The backend needs the user ID, which should be included in the JWT token.
                }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed due to a server error.");
            }

            setMessage({ text: "Review posted successfully!", isError: false });
            
            // Clear form and navigate after success
            setRestaurantName('');
            setContent('');
            setRating(0);
            
            // Redirect to the main Reviews page
            setTimeout(() => navigate('/review'), 1000); 

        } catch (err) {
            setMessage({ text: err.message, isError: true });
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
                    
                    {/* Restaurant Name Input */}
                    <div class="space-y-3">
                        <label className="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Restaurant Name</label>
                        <div className="relative">
                            <input type="text" required placeholder="e.g. UTS Street Cafe" 
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className="w-full p-5 bg-white rounded-3xl shadow-input text-brand-dark font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 focus:shadow-soft" />
                            <svg className="w-5 h-5 absolute right-5 top-1/2 transform -translate-y-1/2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>

                    {/* Star Rating Input */}
                    <div class="space-y-3">
                        <label class="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Your Rating</label>
                        <div class="bg-white p-6 rounded-3xl shadow-input flex flex-col items-center justify-center gap-2">
                            <div class="flex gap-2" id="star-container">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star 
                                        key={i} 
                                        onClick={() => handleRatingChange(i)} 
                                        isFilled={i <= rating}
                                    />
                                ))}
                            </div>
                            <input type="hidden" name="rating" value={rating} />
                            <p className={`text-sm font-semibold mt-1 ${rating > 0 ? 'text-brand-caramel' : 'text-stone-400'}`}>
                                {RATING_TEXTS[rating]}
                            </p>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div class="space-y-3">
                        <label class="text-xs font-bold text-brand-caramel uppercase tracking-wider ml-1">Review</label>
                        <div class="relative">
                            <textarea required rows="6" placeholder="Share your experience... (e.g., The food was amazing but the service was a bit slow.)" 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-5 bg-white rounded-3xl shadow-input text-brand-dark font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 focus:shadow-soft resize-none"></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className={`w-full py-4 rounded-3xl shadow-lg font-bold text-lg transition-all 
                        ${loading 
                            ? 'bg-gray-500 text-white cursor-not-allowed' 
                            : 'bg-brand-dark text-white shadow-brand-dark/20 hover:bg-brand-caramel hover:scale-[1.02] active:scale-95'}`}>
                        {loading ? 'Posting...' : 'Post Review'}
                    </button>
                    
                    <div class="h-4"></div>

                </form>
            </div>

        </div>
    );
}