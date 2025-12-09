import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PremiumPlanPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentTier, setCurrentTier] = useState('free');

    // 1. Check current status on load
    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('id', user.id)
                    .single();
                if (data) setCurrentTier(data.subscription_tier);
            }
        };
        checkStatus();
    }, []);

    // 2. Handle the Upgrade (Simulated Payment)
    const handleSubscribe = async (planName) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // SIMULATE PAYMENT PROCESS HERE...
            // In a real app, you would redirect to Stripe/PayPal here.
            // For this project, we will just instantly upgrade them.

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    subscription_tier: 'premium',
                    subscription_start_date: new Date()
                })
                .eq('id', user.id);

            if (error) throw error;

            alert(`Success! You are now subscribed to the ${planName} plan.`);
            navigate('/profile'); // Go back to profile to see the "Gold/Premium" badge

        } catch (error) {
            console.error("Payment failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col">

            {/* --- HEADER --- */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <Link to="/profile" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors group">
                    <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                
                <h1 className="text-lg font-bold text-brand-dark">Premium Plan</h1>
                <div className="w-12"></div> 
            </div>

            <div className="flex-1 px-6 pb-10 overflow-y-auto hide-scrollbar">

                {/* --- HERO TEXT --- */}
                <section className="text-center mb-8 mt-2">
                    <h2 className="text-2xl font-bold text-brand-dark leading-tight">Unlock Your Ultimate<br/>Food Companion</h2>
                    <p className="text-brand-brown text-sm mt-3 px-2 leading-relaxed">
                        Upgrade to BiteChoice Premium for exclusive tools that make eating smarter, easier, and more fun.
                    </p>
                </section>

                {/* --- PRICING CARDS --- */}
                <div className="space-y-6 mb-10">
                    
                    {/* Monthly Card */}
                    <div className={`bg-white rounded-3xl p-6 shadow-soft border border-stone-50 relative overflow-hidden group transition-all ${currentTier === 'premium' ? 'opacity-50 grayscale' : ''}`}>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-brand-dark">Monthly</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-brand-caramel">RM3.90</span>
                                <span className="text-brand-brown text-sm">/ month</span>
                            </div>
                            <p className="text-stone-400 text-xs mt-2 font-medium">Flexible, pay-as-you-go. Cancel anytime.</p>
                            
                            <button 
                                onClick={() => handleSubscribe('Monthly')}
                                disabled={loading || currentTier === 'premium'}
                                className="w-full mt-6 py-3 bg-stone-100 text-brand-dark font-semibold rounded-2xl hover:bg-stone-200 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : currentTier === 'premium' ? 'Current Plan' : 'Subscribe Monthly'}
                            </button>
                        </div>
                    </div>

                    {/* Annual Card */}
                    <div className={`bg-brand-dark rounded-3xl p-6 shadow-xl shadow-brand-dark/20 relative overflow-hidden ${currentTier === 'premium' ? 'ring-4 ring-green-500' : ''}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
                        
                        <div className="absolute top-4 right-4 bg-brand-caramel text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-lg">
                            Best Value
                        </div>

                        <div className="relative z-10 text-white">
                            <h3 className="text-lg font-bold text-white/90">Annually</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">RM35.00</span>
                                <span className="text-white/60 text-sm">/ year</span>
                            </div>
                            <p className="text-white/60 text-xs mt-2 font-medium">Save 25% (That's ~RM2.92/month)</p>
                            
                            <button 
                                onClick={() => handleSubscribe('Annually')}
                                disabled={loading || currentTier === 'premium'}
                                className="w-full mt-6 py-3 bg-brand-caramel text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : currentTier === 'premium' ? 'Active Plan' : 'Subscribe Annually'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- FEATURES LIST --- */}
                <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-4 px-2">What You'll Get</h2>

                    <div className="grid grid-cols-1 gap-4">

                        {/* Feature 1: Meal Wheel */}
                        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-brand-caramel">
                                <svg className="w-7 h-7 text-brand-caramel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="#eee" />
                                    <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="#FF6347" />
                                    <path d="M 50 50 L 95 50 A 45 45 0 0 1 50 95 Z" fill="#32CD32" />
                                    <path d="M 50 50 L 50 95 A 45 45 0 0 1 5 50 Z" fill="#3357FF" />                    
                                    <path d="M 50 50 L 5 50 A 45 45 0 0 1 50 5 Z" fill="#FFC300" />
                                    <circle cx="50" cy="50" r="10" fill="#fff" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark text-sm">Spin the Meal Wheel</h3>
                                <p className="text-xs text-brand-brown mt-1 leading-relaxed">Can't decide? Let the wheel pick your next delicious meal randomly.</p>
                            </div>
                        </div>

                        {/* Feature 2: Diet Planner */}
                        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark text-sm">Diet Planner</h3>
                                <p className="text-xs text-brand-brown mt-1 leading-relaxed">Create and manage personalized meal plans to hit your health goals.</p>
                            </div>
                        </div>

                        {/* Feature 3: AI Chatbot */}
                        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark text-sm">AI Chatbot</h3>
                                <p className="text-xs text-brand-brown mt-1 leading-relaxed">Instant answers for your nutrition questions and dietary needs.</p>
                            </div>
                        </div>

                        {/* Feature 4: Recipe Generator */}
                        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-brand-light/40 rounded-xl flex items-center justify-center text-brand-dark">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-dark text-sm">Recipe Generator</h3>
                                <p className="text-xs text-brand-brown mt-1 leading-relaxed">Turn ingredients you have at home into delicious recipes.</p>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );

}

