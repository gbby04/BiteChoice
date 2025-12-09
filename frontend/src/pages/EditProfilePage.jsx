import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

export default function EditProfilePage() {
    const navigate = useNavigate();
    
    // Form State
    const [userData, setUserData] = useState({ 
        name: '', 
        email: 'Loading...', 
        gender: 'prefer-not-to-say', 
        birthday: '', 
        profile_image: '' 
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null); // { text: '', isError: false }

    // --- 1. Fetch User Data on Load ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get Auth User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                // Get Profile Data
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url, gender, birthday') // Ensure these columns exist in your DB!
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore 'not found' error if profile is empty
                    throw error;
                }

                setUserData({
                    name: profile?.full_name || '',
                    email: user.email, // Email comes from Auth
                    gender: profile?.gender || 'prefer-not-to-say',
                    birthday: profile?.birthday || '',
                    profile_image: profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=D97706&color=fff`
                });

            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setMessage({ text: "Could not load user data.", isError: true });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    // --- 2. Handle Image Upload ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage (Bucket name: 'avatars')
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update State immediately
            setUserData(prev => ({ ...prev, profile_image: publicUrl }));
            
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Make sure you have an 'avatars' bucket!");
        } finally {
            setIsSaving(false);
        }
    };

    // --- 3. Handle Form Submission (Update Profile) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const updates = {
                id: user.id,
                full_name: userData.name,
                gender: userData.gender,
                birthday: userData.birthday || null, // Handle empty date
                avatar_url: userData.profile_image,
                updated_at: new Date(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates); // Upsert = Insert if new, Update if exists

            if (error) throw error;

            setMessage({ text: "Profile updated successfully!", isError: false });
            
            // Optional: Redirect back after short delay
            setTimeout(() => navigate('/profile'), 1500);

        } catch (error) {
            console.error("Update failed:", error);
            setMessage({ text: "Failed to save changes. " + error.message, isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-app-bg text-brand-brown">Loading...</div>;
    }

    return (
        <div className="bg-app-bg text-brand-dark antialiased min-h-screen flex flex-col">

            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur-sm z-20">
                <Link to="/profile" className="p-3 bg-white rounded-2xl shadow-soft text-brand-dark hover:text-brand-caramel transition-colors group">
                    <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-brand-dark">Edit Profile</h1>
                <div className="w-12"></div> 
            </div>
            
            {message && (
                <div className={`mx-6 mt-4 p-3 rounded-lg text-center font-medium ${message.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 px-6 pb-10 overflow-y-auto hide-scrollbar">
                
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-8 mt-2">
                    <div className="relative group cursor-pointer">
                        <label htmlFor="upload-avatar" className="cursor-pointer">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-soft relative overflow-hidden">
                                <img src={userData.profile_image} alt="Profile" className="w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-90 transition-opacity" />
                            </div>
                            <div className="absolute bottom-0 right-0 p-2 bg-brand-dark text-white rounded-full shadow-lg border-2 border-white">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                </svg>
                            </div>
                        </label>
                        {/* Hidden File Input */}
                        <input 
                            type="file" 
                            id="upload-avatar" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                        />
                    </div>
                    <span className="text-xs text-brand-brown mt-3 font-medium">Tap to change photo</span>
                </div>

                <div className="space-y-6">
                    
                    {/* Full Name */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-brand-brown mb-2 ml-1">Full Name</label>
                        <input type="text" name="name" value={userData.name} onChange={handleChange}
                            className="w-full pl-4 pr-4 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none transition-shadow" placeholder="Enter your name" />
                    </div>

                    {/* Gender */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-brand-brown mb-2 ml-1">Gender</label>
                        <div className="relative">
                            <select name="gender" value={userData.gender} onChange={handleChange}
                                className="w-full pl-4 pr-10 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none appearance-none transition-shadow">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-5 h-5 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Birthday */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-brand-brown mb-2 ml-1">Birthday</label>
                        <input type="date" name="birthday" value={userData.birthday} onChange={handleChange}
                            className="w-full pl-4 pr-4 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none transition-shadow" />
                    </div>

                    {/* Email Address (Readonly) */}
                    <div className="group">
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-sm font-semibold text-brand-brown">Email Address</label>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">Locked</span>
                        </div>
                        <div className="relative">
                            <input type="email" value={userData.email} readOnly className="w-full pl-11 pr-4 py-4 bg-stone-100 rounded-2xl border border-stone-200 text-stone-500 font-medium focus:outline-none cursor-not-allowed select-none" />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 mb-4">
                    <button type="submit" disabled={isSaving} className="w-full py-4 bg-brand-dark text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-dark/20 hover:bg-brand-dark/90 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Changes</span>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );

}

