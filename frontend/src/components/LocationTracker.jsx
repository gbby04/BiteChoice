import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../supabaseClient';

export default function LocationTracker() {
    const navigate = useNavigate(); 
    
    // State variables
    const [restaurants, setRestaurants] = useState([]);
    const [currentCandidate, setCurrentCandidate] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [modalRestaurant, setModalRestaurant] = useState(null);
    const [step, setStep] = useState('ask'); // 'ask' or 'success'
    
    const timerRef = useRef(null);

    // --- 🟢 1. SOUND FUNCTION (Define it here) ---
    const playNotificationSound = () => {
        // Ensure you have 'notification.mp3' in your public folder
        const audio = new Audio('/notification.mp3'); 
        audio.play().catch(e => console.log("Audio play failed", e));
    };

    // --- 2. Fetch Restaurant Locations ---
    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await supabase.rpc('get_nearby_restaurants', {
                lat: 3.1412, 
                long: 101.6865,
                radius_meters: 50000, 
                filter_halal: false,
                max_price: 1000
            });
            setRestaurants(data || []);
        };
        fetchLocations();
    }, []);

    // --- 3. Math Helper (Haversine) ---
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; 
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    };

    // --- 4. The Tracker Logic (GPS Watcher) ---
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watcher = navigator.geolocation.watchPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const nearby = restaurants.find(r => {
                    const d = getDistance(userLat, userLng, r.lat, r.lng);
                    return d < 50; // 50 meters radius
                });

                if (nearby) {
                    if (currentCandidate?.id !== nearby.id) {
                        console.log(`Entered ${nearby.name}... starting timer.`);
                        setCurrentCandidate(nearby);
                        if (timerRef.current) clearTimeout(timerRef.current);

                        // WAIT 10 SECONDS (For Demo)
                        timerRef.current = setTimeout(() => {
                            
                            // 🟢 CHECK SETTINGS HERE 🟢
                            // We check localStorage right when the timer finishes
                            const isEnabled = localStorage.getItem('bitechoice_notifications') !== 'false';

                            if (isEnabled) {
                                setModalRestaurant(nearby);
                                setStep('ask'); 
                                setShowModal(true); 
                                playNotificationSound(); 
                            } else {
                                console.log("User has notifications turned OFF. Staying silent.");
                            }

                        }, 10000); 
                    }
                } else {
                    if (currentCandidate) {
                        console.log("Left the restaurant area.");
                        setCurrentCandidate(null);
                        if (timerRef.current) clearTimeout(timerRef.current);
                    }
                }
            },
            (err) => console.error("GPS Error:", err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, [restaurants, currentCandidate]);

    // --- 6. Handle Actions ---
    
    const handleConfirm = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && modalRestaurant) {
            await supabase.from('user_history').insert({
                user_id: user.id,
                restaurant_id: modalRestaurant.id,
                visited_at: new Date()
            });
            // Switch to success step (don't close yet)
            setStep('success');
        } else {
            setShowModal(false);
        }
    };

    const handleReviewRedirect = () => {
        setShowModal(false);
        navigate(`/writereview?restaurantId=${modalRestaurant.id}`);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentCandidate(null); 
    };

    if (!showModal || !modalRestaurant) return null;

    // --- 7. The UI ---
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform scale-100 transition-all">
                
                {/* STEP 1: ASK USER */}
                {step === 'ask' && (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-brand-light/40 rounded-full flex items-center justify-center mb-4 text-brand-caramel">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Are you eating here?</h3>
                        <p className="text-stone-500 mb-6 text-sm">
                            It looks like you've been at <br/>
                            <strong className="text-brand-brown text-lg">{modalRestaurant.name}</strong> 
                            <br/>for a while.
                        </p>

                        <div className="flex w-full gap-3">
                            <button 
                                onClick={handleClose}
                                className="flex-1 py-3 text-stone-400 font-bold bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                            >
                                No
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl shadow-lg shadow-brand-dark/20 active:scale-95 transition-all"
                            >
                                Yes, Add It
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: SUCCESS & REVIEW OPTION */}
                {step === 'success' && (
                    <div className="flex flex-col items-center text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Visit Logged!</h3>
                        <p className="text-stone-500 mb-6 text-sm">
                            We've added this to your eating history. Would you like to leave a review while you're here?
                        </p>

                        <div className="flex w-full gap-3">
                            <button 
                                onClick={handleClose}
                                className="flex-1 py-3 text-stone-400 font-bold bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                            >
                                Maybe Later
                            </button>
                            <button 
                                onClick={handleReviewRedirect}
                                className="flex-1 py-3 bg-brand-caramel text-white font-bold rounded-xl shadow-lg shadow-brand-caramel/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Review Now
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}