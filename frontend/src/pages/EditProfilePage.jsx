import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3000"; 
const PROFILE_ENDPOINT = `${API_URL}/auth/profile`; 
const UPDATE_ENDPOINT = `${API_URL}/user/profile`; 

// Helper to format date for input field default value
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format YYYY-MM-DD
    return date.toISOString().split('T')[0];
};

export default function EditProfilePage() {
    const [userData, setUserData] = useState({ 
        name: '', 
        email: 'loading...', 
        gender: 'female', 
        birthday: '', 
        profile_image: 'https://ui-avatars.com/api/?name=U&background=D97706&color=fff&size=200' 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // --- 1. Fetch User Data on Load ---
    useEffect(() => {
        const fetchUserData = async () => {
            // NOTE: In a real app, you would retrieve the JWT token from storage
            const MOCK_TOKEN = "MOCK_JWT_TOKEN"; 

            try {
                const response = await fetch(PROFILE_ENDPOINT, {
                    headers: { 'Authorization': `Bearer ${MOCK_TOKEN}` }
                });
                const data = await response.json();
                
                // Assuming the backend returns { user: { name, email, gender, birthday... } }
                const user = data.user || data; 

                setUserData({
                    name: user.name || 'User Name',
                    email: user.email || 'user@example.com',
                    gender: user.gender || 'female',
                    birthday: formatDate(user.birthday), 
                    profile_image: user.profile_image || `https://ui-avatars.com/api/?name=${user.name}&background=D97706&color=fff&size=200`
                });

            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setMessage({ text: "Could not load user data.", isError: true });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // --- 2. Handle Form Submission (Update Profile) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        // NOTE: Photo upload logic is complex and usually involves AWS/Cloudinary, 
        // we omit it here and just update text fields.

        try {
            const response = await fetch(UPDATE_ENDPOINT, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer MOCK_JWT_TOKEN' // Token required by authMiddleware
                },
                body: JSON.stringify({
                    name: userData.name,
                    gender: userData.gender,
                    birthday: userData.birthday,
                    // profile_image update logic goes here...
                }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Update failed.');
            }

            setMessage({ text: "Profile updated successfully!", isError: false });
        } catch (error) {
            setMessage({ text: error.message || "Failed to save changes.", isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };


    if (isLoading) {
        return <div className="p-6 text-center text-brand-brown">Loading profile data...</div>;
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
                        <div className="w-32 h-32 rounded-full p-1 bg-white shadow-soft relative overflow-hidden">
                            <img src={userData.profile_image} alt="Profile" className="w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-90 transition-opacity" />
                        </div>
                        
                        <button type="button" className="absolute bottom-0 right-0 p-2 bg-brand-dark text-white rounded-full shadow-lg border-2 border-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    <span className="text-xs text-brand-brown mt-3 font-medium">Tap to change photo</span>
                </div>

                <div className="space-y-6">
                    
                    {/* Full Name */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-brand-brown mb-2 ml-1">Full Name</label>
                        <div className="relative">
                            <input type="text" name="name" value={userData.name} onChange={handleChange}
                                class="w-full pl-4 pr-4 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none transition-shadow" placeholder="Enter your name" />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-brand-brown mb-2 ml-1">Gender</label>
                        <div className="relative">
                            <select name="gender" value={userData.gender} onChange={handleChange}
                                class="w-full pl-4 pr-10 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none appearance-none transition-shadow">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg class="w-5 h-5 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Birthday */}
                    <div className="group">
                        <label class="block text-sm font-semibold text-brand-brown mb-2 ml-1">Birthday</label>
                        <div class="relative">
                            <input type="date" name="birthday" value={userData.birthday} onChange={handleChange}
                                class="w-full pl-4 pr-4 py-4 bg-white rounded-2xl border-none shadow-input text-brand-dark font-medium focus:ring-2 focus:ring-brand-caramel/50 focus:outline-none transition-shadow" />
                        </div>
                    </div>

                    {/* Email Address (Readonly) */}
                    <div class="group">
                        <div class="flex justify-between items-center mb-2 ml-1">
                            <label class="block text-sm font-semibold text-brand-brown">Email Address</label>
                            <span class="text-[10px] uppercase font-bold tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">Locked</span>
                        </div>
                        <div class="relative">
                            <input type="email" value={userData.email} readOnly class="w-full pl-11 pr-4 py-4 bg-stone-100 rounded-2xl border border-stone-200 text-stone-500 font-medium focus:outline-none cursor-not-allowed select-none" />
                            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <svg class="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-10 mb-4">
                    <button type="submit" disabled={isSaving} class="w-full py-4 bg-brand-dark text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-dark/20 hover:bg-brand-dark/90 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
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