import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

// --- Component for a single History Card ---
const HistoryCard = ({ item }) => {
    // Determine data source (Supabase join returns 'restaurants' object)
    const restaurantName = item.restaurants?.name || 'Unknown Restaurant';
    const restaurantImage = item.restaurants?.image_url || 'https://via.placeholder.com/150';
    const cuisineTag = item.restaurants?.cuisine_type || 'Food';

    // Format Time (HH:MM AM/PM)
    const timeObj = new Date(item.created_at);
    const formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Link to="#" className="bg-white p-4 rounded-3xl shadow-sm border border-stone-50 flex gap-4 transition-all hover:shadow-soft active:scale-98">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-200">
                <img src={restaurantImage} alt={restaurantName} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-brand-dark leading-tight">{restaurantName}</h3>
                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">{cuisineTag}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">{item.items}</p>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                    <span className="font-bold text-brand-caramel text-lg">RM {item.price}</span>
                    <div className="flex items-center text-xs font-medium text-stone-400">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formattedTime}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default function HistoryPage() {
    // We start with flat arrays because Supabase doesn't pre-group them
    const [historyData, setHistoryData] = useState({ today: [], yesterday: [], week: [], older: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- HELPER: Group Data by Date ---
    const groupHistoryByDate = (data) => {
        const groups = { today: [], yesterday: [], week: [], older: [] };
        const now = new Date();
        const todayStr = now.toDateString();
        
        const yesterdayDate = new Date();
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterdayStr = yesterdayDate.toDateString();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        data.forEach(item => {
            const itemDate = new Date(item.created_at);
            const itemDateStr = itemDate.toDateString();

            if (itemDateStr === todayStr) {
                groups.today.push(item);
            } else if (itemDateStr === yesterdayStr) {
                groups.yesterday.push(item);
            } else if (itemDate > oneWeekAgo) {
                groups.week.push(item);
            } else {
                groups.older.push(item);
            }
        });
        return groups;
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // 1. Get Current User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Handle not logged in

                // 2. Fetch History + Join Restaurant Details
                const { data, error } = await supabase
                    .from('user_history')
                    .select(`
                        *,
                        restaurants ( name, image_url, cuisine_type )
                    `)
                    .eq('user_id', user.id) // Only get MY history
                    .order('created_at', { ascending: false }); // Newest first

                if (error) throw error;

                // 3. Group the data manually
                const grouped = groupHistoryByDate(data || []);
                setHistoryData(grouped);

            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // --- Filter Logic ---
    const filteredHistory = Object.keys(historyData).reduce((acc, key) => {
        const filteredGroup = historyData[key].filter(item => {
            const restName = item.restaurants?.name || '';
            const items = item.items || '';
            return restName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   items.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        if (filteredGroup.length > 0) {
            acc[key] = filteredGroup;
        }
        return acc;
    }, {});


    // --- Render Section Helper ---
    const renderSection = (title, key) => {
        if (!filteredHistory[key] || filteredHistory[key].length === 0) return null;
        
        return (
            <div>
                <h2 className="text-sm font-bold text-brand-brown uppercase tracking-wider mb-3">{title}</h2>
                <div className="space-y-4" id={`history-${key}`}>
                    {filteredHistory[key].map(item => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-app-bg text-brand-dark antialiased pb-28 min-h-screen">

            {/* HEADER AND SEARCH */}
            <div className="px-6 pt-8 pb-2 bg-app-bg sticky top-0 z-30">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/home" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-brand-dark">Eating History</h1>
                    <div className="w-10 h-10"></div> {/* Spacer to center title */}
                </div>

                {/* Search Input */}
                <div className="relative group mb-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-brand-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Where did I eat..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-4 bg-white border-none rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-caramel/50 text-brand-dark placeholder-brand-brown/50 transition-all"
                    />
                </div>
            </div>

            {/* --- HISTORY CONTENT --- */}
            <div className="px-6 space-y-6 mt-4">
                {isLoading ? (
                    <div className="flex flex-col items-center pt-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-caramel mb-2"></div>
                        <div className="text-brand-brown font-medium">Retrieving history...</div>
                    </div>
                ) : (
                    <>
                        {renderSection("Today", "today")}
                        {renderSection("Yesterday", "yesterday")}
                        {renderSection("Last Week", "week")}
                        {renderSection("Older", "older")}

                        {Object.keys(filteredHistory).length === 0 && (
                            <div className="text-center pt-10 text-stone-400">No matching history found.</div>
                        )}
                    </>
                )}
            </div>

            {/* --- BOTTOM NAVIGATION --- */}
            <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 shadow-nav z-40 pb-safe bg-white/90 backdrop-blur-lg">
                <div className="flex justify-around items-center p-4 max-w-md mx-auto">
                    <Link to="/home" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                    </Link>
                    <Link to="/favourites" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </Link>
                    
                    {/* Eating History (Active) */}
                    <Link to="/history" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-brand-caramel">
                        <div className="relative p-1">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-caramel rounded-full"></span>
                        </div>
                    </Link>

                    <Link to="/review" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.35 1.129l-4.243 3.527a.563.563 0 00-.182.557l1.285 5.385a.555.555 0 01-.793.578L12 17.51l-4.708 2.876a.555.555 0 01-.793-.578l1.285-5.385a.563.563 0 00-.182-.557l-4.243-3.527c-.42-.359-.195-1.085.35-1.129l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    </Link>
                    <Link to="/profile" className="nav-item group flex flex-col items-center gap-1 w-1/5 text-stone-400 hover:text-brand-brown transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </Link>
                </div>
            </nav>
        </div>
    );
}