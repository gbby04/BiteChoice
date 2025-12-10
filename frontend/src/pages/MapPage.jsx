import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function MapPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [userLocation, setUserLocation] = useState(null); // Start null to wait for GPS
    const navigate = useNavigate();
    const mapRef = useRef(null); // Keep track of the map instance

    // --- 1. GET USER LOCATION & DATA ---
    useEffect(() => {
        // Get the actual GPS position of the phone
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                // Call Supabase with the REAL coordinates
                const { data, error } = await supabase.rpc('get_nearby_restaurants', {
                    lat: latitude,
                    long: longitude,
                    radius_meters: 5000, // 5km radius
                    filter_halal: false, // Default filter
                    max_price: 100
                });

                if (error) console.error("Supabase error:", error);
                else setRestaurants(data || []);
            },
            (error) => {
                console.error("Error getting location:", error);
                // Fallback to a default location (e.g., your university campus)
                setUserLocation({ lat: 3.1412, lng: 101.6865 });
            }
        );
    }, []);

    // --- 2. GOOGLE MAPS RENDERING ---
    useEffect(() => {
        if (typeof window.google !== 'undefined' && userLocation && !mapRef.current) {
            
            // Initialize Map
            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 14,
                center: userLocation,
                disableDefaultUI: true,
                styles: [
                            {
                                "elementType": "geometry",
                                "stylers": [{ "color": "#FFFBF5" }] // Your App Background
                            },
                            {
                                "elementType": "labels.text.fill",
                                "stylers": [{ "color": "#4E342E" }] // Your Brand Dark Text
                            },
                            {
                                "elementType": "labels.text.stroke",
                                "stylers": [{ "color": "#FFFFFF" }]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{ "color": "#c9b2a6" }]
                            },
                            {
                                "featureType": "landscape.natural",
                                "elementType": "geometry",
                                "stylers": [{ "color": "#FFFBF5" }]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{ "color": "#e8e4dc" }] // Slightly darker cream for places
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.text.fill",
                                "stylers": [{ "color": "#8D6E63" }] // Brand Brown
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{ "color": "#FFFFFF" }] // White roads stand out on cream
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry.stroke",
                                "stylers": [{ "color": "#d6cec5" }]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry",
                                "stylers": [{ "color": "#D97706" }] // Your Brand Caramel for Highways
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [{ "color": "#C3D7E8" }] // Soft blue that fits the warm theme
                            },
                            {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [{ "color": "#92998d" }]
                            }
                        ] 
                });
            
            mapRef.current = map; // Save map to ref so we don't re-create it constantly

            // Add User Marker (Blue Dot)
            new window.google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white",
                },
                title: "You"
            });
        }

        // Add Restaurant Markers (Update whenever 'restaurants' changes)
        if (mapRef.current && restaurants.length > 0) {
            restaurants.forEach(rest => {
                const marker = new window.google.maps.Marker({
                    position: { lat: rest.lat, lng: rest.lng }, // Uses data from Supabase
                    map: mapRef.current,
                    title: rest.name,
                });

                // Optional: Click marker to scroll to card
                marker.addListener("click", () => {
                   navigate(`/restaurant/${rest.id}`, {state: { distance: rest.dist_meters }});
                });
            });
        }
    }, [userLocation, restaurants]);

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
            </div>

            {/* Map Container */}
            <div id="map" className="w-full h-full bg-stone-200">
                {!userLocation && (
                    <div className="flex items-center justify-center h-full text-stone-400 font-medium">
                        Finding your location...
                    </div>
                )}
            </div>

            {/* Bottom Card Carousel */}
            <div className="absolute bottom-0 left-0 w-full z-20 pb-8 pt-4 bg-gradient-to-t from-app-bg via-app-bg/10 to-transparent">
                <div className="flex overflow-x-auto hide-scrollbar px-6 gap-4 pb-2 snap-x snap-mandatory">
                    {restaurants.map((item, index) => (
                        <Link to={`/restaurant/${item.id}`} state={{ distance: item.dist_meters }}
                            key={index} className="snap-center shrink-0 w-72 bg-white p-3 rounded-2xl shadow-card border border-stone-50 flex gap-3 cursor-pointer hover:scale-[1.02] transition-transform">
                            {/* Make sure your DB has an 'image_url' column! */}
                            <img src={item.image_url || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-xl object-cover bg-stone-100" alt={item.name} />
                            <div className="flex flex-col justify-center">
                                <h3 className="font-bold text-brand-dark text-sm mb-1">{item.name}</h3>
                                <div className="flex items-center text-xs text-brand-brown mb-2">
                                    <span className="text-brand-caramel font-bold mr-1">{item.rating || 'New'}</span>
                                    <span className="text-stone-300">•</span>
                                    {/* Convert meters to KM */}
                                    <span className="ml-1">{(item.dist_meters / 1000).toFixed(1)}km</span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded w-fit ${item.is_halal ? 'text-green-600 bg-green-50' : 'text-stone-400 bg-stone-50'}`}>
                                    {item.is_halal ? 'Halal' : 'Non-Halal'}
                                </span>
                            </div>
                        </Link>
                    ))}
                    <div className="w-2 shrink-0"></div> 
                </div>
            </div>
        </div>
    );
}








