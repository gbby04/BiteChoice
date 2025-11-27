import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

// The address of your Backend Server
const API_URL = "http://localhost:3000"; 

export default function Home() {
  // --- 1. STATE MANAGEMENT ---
  const [restaurants, setRestaurants] = useState([]);
  const [userPrefs, setUserPrefs] = useState({ name: "Gabriela" }); 
  
  const [activeTime, setActiveTime] = useState('morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State (Matching your HTML Modal)
  const [filters, setFilters] = useState({
    category: 'All',      // 'All', 'Fast Food', 'Healthy', 'Asian'
    dietary: 'All',       // 'All', 'Halal', 'Non-Halal'
    maxDist: 5,           // Default 5km
    maxPrice: 25,         // Default RM 25
  });

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants`);
        const data = await res.json();
        setRestaurants(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error connecting to Backend:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 3. FILTER LOGIC ---
  
  // A. Recommendations (Top Row) - Filtered ONLY by Time (Morning/Lunch/etc)
  const filteredRecs = useMemo(() => {
    if (!restaurants.length) return [];
    // If backend doesn't have 'tags', we just return everything. 
    // Otherwise we check if the activeTime is inside the restaurant tags.
    return restaurants.filter(item => {
        // Mocking tags if missing from DB for demo purposes
        const tags = item.tags || ['morning', 'lunch', 'dinner', 'snack']; 
        return tags.includes(activeTime);
    });
  }, [activeTime, restaurants]);

  // B. Nearby Restaurants (Bottom List) - Filtered by Search + Modal Settings
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(item => {
      // 1. Search Bar
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.cuisine_type || "").toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Modal: Category (Fast Food, Asian, etc)
      const matchCategory = filters.category === 'All' || 
                            (item.cuisine_type || "").toLowerCase().includes(filters.category.toLowerCase());

      // 3. Modal: Dietary (Halal/Non-Halal)
      const matchDiet = filters.dietary === 'All' || 
                        (filters.dietary === 'Halal' ? item.is_halal : !item.is_halal);

      // 4. Modal: Distance
      // If DB doesn't have dist, assume random 1.5km
      const itemDist = item.dist || 1.5; 
      const matchDist = itemDist <= filters.maxDist;

      // 5. Modal: Price
      const matchPrice = (item.average_price || 0) <= filters.maxPrice;

      return matchSearch && matchCategory && matchDiet && matchDist && matchPrice;
    });
  }, [searchQuery, filters, restaurants]);


  if (isLoading) return <div className="flex h-screen items-center justify-center text-brand-brown font-bold animate-pulse">Loading your cravings...</div>;

  return (
    <div className="bg-app-bg min-h-screen text-brand-dark font-sans pb-28">
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-brand-brown font-medium text-sm">Good Morning,</p>
            <h1 className="text-2xl font-bold text-brand-dark">{userPrefs.name}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
             <img src={`https://ui-avatars.com/api/?name=${userPrefs.name}&background=D97706&color=fff`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-brand-brown group-focus-within:text-brand-caramel transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <input 
              type="text" 
              placeholder="Find your craving..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-white border-none rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-caramel/50 text-brand-dark placeholder-brand-brown/50 transition-all"
            />
          </div>

          <button onClick={() => setIsModalOpen(true)} className="p-3.5 bg-brand-dark text-white rounded-2xl shadow-soft active:scale-95 transition-transform">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- TIME CHIPS --- */}
      <div className="pl-6 mb-8">
        <div className="flex space-x-3 overflow-x-auto pb-4 hide-scrollbar pr-6">
          {[
            { id: 'morning', icon: '☀️', label: 'Morning' },
            { id: 'lunch', icon: '🍔', label: 'Lunch' },
            { id: 'dinner', icon: '🌙', label: 'Dinner' },
            { id: 'snack', icon: '🍿', label: 'Snacks' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTime(item.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold rounded-full shadow-sm whitespace-nowrap transition-transform active:scale-95 
                ${activeTime === item.id 
                  ? 'bg-brand-caramel text-white shadow-lg shadow-brand-caramel/30' 
                  : 'bg-white text-brand-brown border border-stone-100 hover:bg-stone-50'}`}
            >
              <span>{item.icon}</span> <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- RECOMMENDATIONS (Horizontal) --- */}
      <section className="mb-8 pl-6">
        <div className="flex justify-between items-end mb-4 pr-6">
            <h2 className="text-xl font-bold text-brand-dark">Recommended</h2>
            <a href="#" className="text-sm font-medium text-brand-caramel hover:text-brand-dark transition-colors">See all</a>
        </div>

        <div className="flex space-x-5 overflow-x-auto pb-6 hide-scrollbar pr-6 snap-x snap-mandatory">
          {filteredRecs.map((item, index) => (
            <div key={index} className="snap-start shrink-0 w-64 relative group">
                <div className="h-80 rounded-3xl overflow-hidden shadow-soft relative bg-white">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
                            <div className="flex items-center bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                                <span className="text-yellow-400 text-xs mr-1">★</span>
                                <span className="text-xs font-bold">4.8</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center opacity-90">
                            <span className="text-sm font-medium">15 min</span>
                            <span className="text-lg font-bold">RM {item.average_price}</span>
                        </div>
                    </div>

                    {/* Heart Button */}
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                </div>
            </div>
          ))}
          {filteredRecs.length === 0 && <p className="text-stone-400">No morning items found.</p>}
        </div>
      </section>

      {/* --- NEARBY RESTAURANTS (Vertical) --- */}
      <section className="px-6 mb-4">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-brand-dark">Nearby Restaurants</h2>
            
            <a href="#" className="text-sm font-semibold text-brand-caramel hover:text-brand-dark transition-colors flex items-center gap-1">
                View Map
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            </a>
        </div>

        <div className="space-y-4">
          {filteredRestaurants.map((item, index) => (
            <Link to="#" key={index} className="flex items-center bg-white p-3 rounded-3xl shadow-sm border border-stone-50 hover:shadow-soft transition-all active:scale-98">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-brand-dark text-lg leading-tight">{item.name}</h3>
                        <span className="text-xs font-bold text-brand-brown bg-stone-100 px-2 py-1 rounded-lg">
                          {item.dist ? item.dist + "km" : "1.2km"}
                        </span>
                    </div>
                    <p className="text-sm text-stone-400 mb-2 truncate">{item.cuisine_type}</p>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center text-brand-caramel font-bold text-sm">
                            <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            4.5 <span className="text-stone-300 font-normal ml-1">(120)</span>
                        </div>
                        {item.is_halal && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Halal</span>}
                    </div>
                </div>
            </Link>
          ))}
          {filteredRestaurants.length === 0 && (
             <div className="text-center py-10 text-stone-400">
                <p>No matches for your filter.</p>
                <button onClick={() => setFilters({category:'All', dietary:'All', maxDist: 20, maxPrice: 100})} className="underline">Reset</button>
             </div>
          )}
        </div>
      </section>

      {/* --- FILTER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            
            {/* Content */}
            <div className="relative bg-app-bg w-full rounded-t-3xl p-6 flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]">
                {/* Handle bar */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark">Filter</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full text-stone-400 hover:text-brand-dark shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="overflow-y-auto space-y-8 flex-1 pb-4 hide-scrollbar">
                    {/* Category */}
                    <section>
                        <h3 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wide">Categories</h3>
                        <div className="flex flex-wrap gap-3">
                            {['All', 'Fast Food', 'Healthy', 'Asian'].map(cat => (
                                <button key={cat} onClick={() => setFilters({...filters, category: cat})}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${filters.category === cat ? 'bg-brand-caramel text-white shadow-md border-transparent' : 'bg-white text-brand-brown shadow-sm border-stone-100'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Dietary */}
                    <section>
                        <h3 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wide">Dietary</h3>
                        <div className="flex gap-3">
                            {['All', 'Halal', 'Non-Halal'].map(diet => (
                                <button key={diet} onClick={() => setFilters({...filters, dietary: diet})}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${filters.dietary === diet ? 'bg-brand-caramel text-white shadow-md border-transparent' : 'bg-white text-brand-brown shadow-sm border-stone-100'}`}>
                                    {diet}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Distance Slider */}
                    <section>
                        <div className="flex justify-between mb-3">
                            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wide">Distance</h3>
                            <span className="text-brand-caramel font-bold">{filters.maxDist}km</span>
                        </div>
                        <div className="px-1">
                            <input type="range" min="1" max="20" value={filters.maxDist} 
                                onChange={(e) => setFilters({...filters, maxDist: parseInt(e.target.value)})}
                                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-caramel" />
                        </div>
                    </section>

                    {/* Price Slider */}
                    <section>
                        <div className="flex justify-between mb-3">
                            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wide">Max Price</h3>
                            <span className="text-brand-caramel font-bold">RM {filters.maxPrice}</span>
                        </div>
                        <div className="px-1">
                            <input type="range" min="5" max="150" value={filters.maxPrice} step="5"
                                onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-caramel" />
                        </div>
                    </section>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200 flex space-x-4">
                    <button onClick={() => setFilters({category:'All', dietary:'All', maxDist: 5, maxPrice: 25})} className="w-1/3 py-4 text-brand-brown font-bold rounded-2xl hover:bg-stone-100 transition-colors">Reset</button>
                    <button onClick={() => setIsModalOpen(false)} className="w-2/3 py-4 bg-brand-dark text-white font-bold rounded-2xl shadow-lg shadow-brand-dark/20 active:scale-95 transition-transform">Apply Filters</button>
                </div>
            </div>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 shadow-nav z-40 pb-4 pt-2" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
            {/* Home (Active) */}
            <Link to="/home" className="flex flex-col items-center gap-1 w-1/5 text-brand-caramel">
                <div className="relative p-1">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.06 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-caramel rounded-full"></span>
                </div>
            </Link>
            
            {/* Favourites */}
            <Link to="#" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </Link>
            
            {/* Eating History */}
            <Link to="#" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </Link>

            {/* Review */}
            <Link to="#" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.35 1.129l-4.243 3.527a.563.563 0 00-.182.557l1.285 5.385a.555.555 0 01-.793.578L12 17.51l-4.708 2.876a.555.555 0 01-.793-.578l1.285-5.385a.563.563 0 00-.182-.557l-4.243-3.527c-.42-.359-.195-1.085.35-1.129l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            </Link>

            {/* Profile */}
            <Link to="#" className="flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </Link>
        </div>
      </nav>

    </div>
  );
}