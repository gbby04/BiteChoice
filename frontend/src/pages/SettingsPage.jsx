import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SettingsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [locationEnabled, setLocationEnabled] = useState(true);

    // 1. Load User Data
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Get User Auth
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }
                setEmail(user.email); // Email comes from Auth, not Profile table

                // Get Profile Data
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, location_enabled') // Make sure to add location_enabled column to DB if you want to save it!
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || '');
                    // location_enabled might not exist yet if you haven't added the column, defaulting to true
                    if (profile.location_enabled !== undefined) setLocationEnabled(profile.location_enabled);
                }

            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [navigate]);


    // 2. Save Changes (Profile Info)
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    full_name: fullName,
                    // If you added location_enabled column:
                    // location_enabled: locationEnabled 
                })
                .eq('id', user.id);

            if (error) throw error;
            alert("Profile updated successfully!");
            
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // 3. Password Reset Request
    const handlePasswordReset = async () => {
        const confirmReset = window.confirm("We will send a password reset link to your email. Continue?");
        if (!confirmReset) return;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password', // You need a page for this
            });
            if (error) throw error;
            alert("Check your email for the password reset link!");
        } catch (error) {
            console.error("Error sending reset email:", error);
            alert("Error sending email: " + error.message);
        }
    };

    // 4. Delete Account (Warning: This requires specific setup in Supabase to work fully)
    const handleDeleteAccount = async () => {
        const confirmDelete = window.prompt("Type 'DELETE' to confirm deleting your account permanently. This cannot be undone.");
        if (confirmDelete !== 'DELETE') return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            // NOTE: Client-side deletion of the USER (Auth) is usually blocked for security.
            // Standard practice: Delete the data, sign them out, and mark account 'deleted' in DB.
            // Or use a Supabase Edge Function with Admin rights.
            
            // For this demo, we will just sign out and pretend.
            // Real implementation requires: supabase.rpc('delete_user') [Server-side function]

            await supabase.auth.signOut();
            alert("Account scheduled for deletion. Goodbye!");
            navigate('/');

        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-app-bg text-brand-brown">Loading Settings...</div>;

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col">

            {/* --- HEADER --- */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <Link to="/profile" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold text-brand-dark">Settings</h1>
                <div className="w-12"></div> 
            </div>

            <div className="flex-1 px-6 pb-10 overflow-y-auto hide-scrollbar">

                {/* --- PERSONAL INFO --- */}
                <section className="mb-6">
                    <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 pl-2">Personal Info</h2>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50 space-y-4">
                        
                        <div>
                            <label className="block text-xs font-medium text-brand-brown mb-1">Full Name</label>
                            <div className="flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-3">
                                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-transparent w-full outline-none text-brand-dark font-medium placeholder-stone-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-brand-brown mb-1">Email Address</label>
                            <div className="flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-3 opacity-60 cursor-not-allowed">
                                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {/* Email is read-only usually */}
                                <input 
                                    type="email" 
                                    value={email}
                                    readOnly
                                    className="bg-transparent w-full outline-none text-brand-dark font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full py-3 text-sm font-semibold text-brand-caramel bg-brand-light/20 rounded-xl hover:bg-brand-light/40 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </section>

                {/* --- SECURITY --- */}
                <section className="mb-6">
                    <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 pl-2">Password & Security</h2>
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-stone-50">
                        
                        <button onClick={handlePasswordReset} className="w-full flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-light/50 rounded-full text-brand-caramel">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-brand-dark">Change Password</span>
                            </div>
                            <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        {/* Toggle Example (UI Only for now) */}
                        <div className="flex items-center justify-between p-4 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-stone-100 rounded-full text-stone-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block font-medium text-brand-dark">Face ID</span>
                                    <span className="text-xs text-brand-brown">Secure & fast login</span>
                                </div>
                            </div>
                            
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="faceid-toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-stone-300"/>
                                <label htmlFor="faceid-toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-stone-300 cursor-pointer"></label>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- LOCATION --- */}
                <section className="mb-8">
                    <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 pl-2">Location</h2>
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-50">
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-light/50 rounded-full text-brand-caramel">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block font-medium text-brand-dark">Location Services</span>
                                </div>
                            </div>
                            
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    type="checkbox" 
                                    id="location-toggle" 
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-stone-300" 
                                    checked={locationEnabled}
                                    onChange={(e) => setLocationEnabled(e.target.checked)}
                                />
                                <label htmlFor="location-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${locationEnabled ? 'bg-brand-caramel' : 'bg-stone-300'}`}></label>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-app-bg border border-brand-light/30">
                            <p className="text-xs text-brand-brown leading-relaxed">
                                Enabling location helps us show you where you've eaten on the map and suggest nearby favorites.
                            </p>
                        </div>

                    </div>
                </section>

                {/* --- DELETE ACCOUNT --- */}
                <button 
                    onClick={handleDeleteAccount}
                    className="w-full py-4 text-stone-400 font-medium text-sm hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors flex items-center justify-center gap-2 mb-4 group"
                >
                    <svg className="w-5 h-5 group-hover:text-red-500 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                </button>

            </div>
        </div>
    );
}