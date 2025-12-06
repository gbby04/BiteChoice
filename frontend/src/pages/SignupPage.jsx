import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

// --- Eye Icon Component ---
const EyeIcon = ({ isVisible }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-theme-subtext" 
        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        {isVisible ? (
            <>
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.81 13.81 0 0 0 2 12s3 7 10 7a9.76 9.76 0 0 0 5.46-1.39" />
            </>
        ) : (
            <>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        // 1. Basic Validation
        if (password !== confirmPassword) {
            setMessage({ text: "Passwords do not match.", isError: true });
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setMessage({ text: "Password must be at least 6 characters.", isError: true });
            setLoading(false);
            return;
        }

        try {
            // 2. Call Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // This data is passed to the SQL Trigger to create the Profile!
                    data: {
                        full_name: name,
                        avatar_url: `https://ui-avatars.com/api/?name=${name}&background=D97706&color=fff`
                    }
                }
            });

            if (error) throw error;

            // 3. Handle Success
            // Check if email confirmation is required (Supabase default)
            if (data?.session) {
                // If Auto-Confirm is ON:
                setMessage({ text: 'Registration successful! Logging you in...', isError: false });
                setTimeout(() => navigate('/home'), 1500); 
            } else {
                // If Email Confirmation is ON:
                setMessage({ text: 'Success! Please check your email to confirm your account.', isError: false });
            }

        } catch (err) {
            console.error("Signup Error:", err);
            setMessage({ text: err.message, isError: true });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-gradient-radial from-theme-page-bg-start to-theme-page-bg-end font-sans antialiased text-theme-text flex flex-col min-h-screen">

            {/* Top decorative wave and Back link */}
            <div className="relative w-full h-40 overflow-hidden" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 320\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path fill=\\'%23FDF9F6\\' fill-opacity=\\'1\\' d=\\'M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z\\'></path></svg>')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <Link to="/" className="absolute top-4 left-4 text-theme-arrow font-semibold hover:text-theme-arrow-hover transition-colors duration-200">
                    &larr; Back
                </Link>
            </div>

            {/* Main content card */}
            <div className="relative flex-grow bg-theme-card-bg rounded-t-3xl shadow-xl -mt-10 p-8 md:p-10 z-10 flex flex-col justify-between">
                
                <div>
                    <h1 className="text-3xl font-bold text-center text-theme-brown-text mb-3">
                        Create Your Account
                    </h1>
                    <p className="text-center text-theme-brown-text text-sm mb-8">
                        Start finding your perfect meal!
                    </p>

                    {/* Signup Form */}
                    <form onSubmit={handleSignup}>
                        <div className="space-y-6">
                            
                            {/* Full Name */}
                            <div>
                                <label htmlFor="full-name" className="sr-only">Full Name</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="full-name" name="full-name" type="text" autoComplete="name"
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Enter full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="email" name="email" type="email" autoComplete="email" required
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required 
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <EyeIcon isVisible={showPassword} />
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required 
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <EyeIcon isVisible={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>

                            {/* Message Area */}
                            <div className="h-5 pt-1 text-center">
                                {message && (
                                    <p className={`text-sm ${message.isError ? 'text-red-500' : 'text-green-600'}`}>
                                        {message.text}
                                    </p>
                                )}
                            </div>

                            {/* Sign Up Button */}
                            <div className="pt-2">
                                <button type="submit" disabled={loading}
                                    className={`group relative flex w-full justify-center items-center rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-dark/30 transition-all duration-300 active:scale-95 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-brand-dark hover:-translate-y-1'}`}>
                                    <span id="login-button-text">
                                        {loading ? 'Signing Up...' : 'Sign Up'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* "Sign in with" Divider */}
                    <div className="relative my-9">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-theme-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-theme-card-bg px-2 text-theme-subtext">Sign up with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="flex justify-center gap-6">
                        {/* You can implement Google Auth later via Supabase Dashboard */}
                        <button 
                            onClick={() => alert("Configure Google Auth in Supabase Dashboard!")}
                            className="social-button google flex items-center justify-center h-12 w-12 rounded-full border border-theme-social-border bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-colors duration-200" aria-label="Signup with Google">
                            <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="h-8 w-8" />
                        </button>
                        <button className="social-button apple flex items-center justify-center h-12 w-12 rounded-full border border-theme-social-border bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-colors duration-200" aria-label="Signup with Apple">
                            <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple" className="h-8 w-8" />
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <p className="mt-9 text-center text-sm text-theme-text flex-shrink-0">
                    Already have an account?
                    <Link to="/login" className="font-semibold text-brand-dark hover:underline transition-colors duration-200 ml-1">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}