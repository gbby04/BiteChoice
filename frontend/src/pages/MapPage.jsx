import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Note: In a production app, the Google Maps API script tag (with your key) 
// must be added to frontend/index.html to ensure the 'google' object is available.

// Mock data (from your seeded database)
const MOCK_RESTAURANTS = [
    { name: "Sushi Master", cuisine: "Japanese", rating: 4.8, dist: 0.8, open: true, lat: 40.7150, lng: -74.0040, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&q=80" },
    { name: "Luigi's Pizza", cuisine: "Italian", rating: 4.5, dist: 1.2, open: false, lat: 40.7100, lng: -74.0080, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80" },
    { name: "Daily Grind", cuisine: "Cafe", rating: 4.9, dist: 0.3, open: true, lat: 40.7130, lng: -74.0070, image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=150&q=80" },
];

export default function MapPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Mock NYC location
    
    // Replace with your API call to get restaurants with location data
    useEffect(() => {
        // NOTE: In a real app, you would fetch data from /restaurants here.
        setRestaurants(MOCK_RESTAURANTS);
    }, []);


    // --- GOOGLE MAPS INTEGRATION LOGIC ---
    useEffect(() => {
        // This checks if the Google Maps script has successfully loaded
        if (typeof window.google !== 'undefined' && restaurants.length > 0) {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 14,
                center: userLocation,
                disableDefaultUI: true,
            });

            // Add Markers for all nearby restaurants
            restaurants.forEach(rest => {
                new window.google.maps.Marker({
                    position: { lat: rest.lat, lng: rest.lng },
                    map: map,
                    title: rest.name,
                });
            });

            // Add a marker for the user's current location (optional)
            new window.google.maps.Marker({
                position: userLocation,
                map: map,
                title: "You are here",
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }
            });
        }
    }, [restaurants, userLocation]);
    // The dependency array ensures the map updates when data is fetched.

    // --- JSX RENDER (Converted from your HTML) ---
    return (
        <div className="bg-app-bg text-brand-dark antialiased h-screen flex flex-col overflow-hidden relative">

            {/* Top Navigation Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start">
                {/* Back Button (Links back to Home) */}
                <Link to="/home" className="pointer-events-auto p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>

                {/* Filter Button */}
                <button className="pointer-events-auto p-3 bg-brand-dark text-white rounded-2xl shadow-soft shadow-brand-dark/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </button>
            </div>

            {/* Map Container */}
            <div id="map" className="w-full h-full bg-stone-200">
                {/* Loading State visible until JS renders the map */}
                <div className="flex items-center justify-center h-full text-stone-400 font-medium">
                    Loading Map...
                </div>
            </div>

            {/* Bottom Card Carousel */}
            <div className="absolute bottom-0 left-0 w-full z-20 pb-8 pt-4 bg-gradient-to-t from-app-bg via-app-bg/10 to-transparent">
                <div className="px-6 mb-2 flex justify-between items-end">
                    <h2 className="text-sm font-bold text-brand-dark bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">Nearby</h2>
                </div>

                <div className="flex overflow-x-auto hide-scrollbar px-6 gap-4 pb-2 snap-x snap-mandatory">
                    {restaurants.map((item, index) => (
                        <div key={index} className="snap-center shrink-0 w-72 bg-white p-3 rounded-2xl shadow-card border border-stone-50 flex gap-3 cursor-pointer hover:scale-[1.02] transition-transform">
                            <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-stone-100" alt={item.name} />
                            <div className="flex flex-col justify-center">
                                <h3 className="font-bold text-brand-dark text-sm mb-1">{item.name}</h3>
                                <div className="flex items-center text-xs text-brand-brown mb-2">
                                    <span className="text-brand-caramel font-bold mr-1">{item.rating}</span>
                                    <span className="text-stone-300">•</span>
                                    <span className="ml-1">{item.cuisine} • {item.dist}km</span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded w-fit ${item.open ? 'text-green-600 bg-green-50' : 'text-stone-400 bg-stone-50'}`}>
                                    {item.open ? 'Open Now' : 'Closes 10 PM'}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div className="w-2 shrink-0"></div> 
                </div>
            </div>
        </div>
    );
}