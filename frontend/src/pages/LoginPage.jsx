import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Address of your backend's authentication route
const API_URL = "http://localhost:3000"; 
const LOGIN_ENDPOINT = `${API_URL}/auth/login`;

// --- Updated Eye Icon Component (Embeds SVG) ---
const EyeIcon = ({ isVisible }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-theme-subtext" 
        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        {isVisible ? (
            // Eye Off SVG
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.81 13.81 0 0 0 2 12s3 7 10 7a9.76 9.76 0 0 0 5.46-1.39" />
        ) : (
            // Eye Open SVG
            <>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- Form Submission Logic (Connects to your backend) ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Controller returns 'error' or 'message' on failure
                throw new Error(data.error || data.message || 'Invalid email or password.');
            }

            // Success response: JWT token received
            setMessage({ text: 'Login successful! Redirecting...', isError: false });
            
            // In a real app, you would save the token (data.token) here 
            
            // Navigate to the main app dashboard
            setTimeout(() => navigate('/home'), 1500); 

        } catch (err) {
            setMessage({ text: err.message, isError: true });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-gradient-radial from-theme-page-bg-start to-theme-page-bg-end font-sans antialiased text-theme-text flex flex-col min-h-screen">

            {/* Top decorative wave and "Back" button */}
            <div className="relative w-full h-40 overflow-hidden" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 320\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path fill=\\'%23FDF9F6\\' fill-opacity=\\'1\\' d=\\'M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z\\'></path></svg>')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <Link to="/" className="absolute top-4 left-4 text-theme-arrow font-semibold hover:text-theme-arrow-hover transition-colors duration-200">
                    &larr; Back
                </Link>
            </div>

            {/* Main content area, simulating the white card */}
            <div className="relative flex-grow bg-theme-card-bg rounded-t-3xl shadow-xl -mt-10 p-8 md:p-10 z-10 flex flex-col justify-between">
                
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-center text-theme-brown-text mb-3">
                        Welcome Back!
                    </h1>
                    <p className="text-center text-theme-brown-text text-sm mb-8">
                        Hungry but can’t choose? <br /> Let BiteChoice help you out!
                    </p>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="email" name="email" type="email" autocomplete="email" required
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative w-full rounded-xl p-[1px] bg-stone-200 focus-within:bg-brand-dark focus-within:ring-2 focus-within:ring-brand-dark/20 transition-all duration-200">
                                    <input id="password" name="password" type={showPassword ? "text" : "password"} autocomplete="current-password" required
                                        className="w-full appearance-none rounded-[11px] bg-white border-0 px-4 py-3 placeholder-theme-subtext text-theme-text text-base focus:outline-none focus:ring-0"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    
                                    {/* Password Toggle Button */}
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <EyeIcon isVisible={showPassword} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-right text-sm mt-4">
                                <Link to="#" className="font-medium text-brand-dark hover:underline transition-colors duration-200">
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="h-5 pt-1 text-center">
                                {/* Display Login Message */}
                                {message && (
                                    <p className={`text-sm ${message.isError ? 'text-red-500' : 'text-green-600'}`}>
                                        {message.text || message}
                                    </p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button type="submit" disabled={loading}
                                    className={`group relative flex w-full justify-center items-center rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-dark/30 transition-all duration-300 hover:shadow-brand-dark/50 active:scale-95 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-brand-dark hover:-translate-y-1'}`}>
                                    <span id="login-button-text">
                                        {loading ? 'Logging In...' : 'Log In'}
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
                            <span className="bg-theme-card-bg px-2 text-theme-subtext">Sign in with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="flex justify-center gap-6">
                        <button 
                            className="social-button google flex items-center justify-center h-12 w-12 rounded-full border border-theme-social-border bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-colors duration-200" aria-label="Login with Google">
                            <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="h-8 w-8" />
                        </button>
                        <button className="social-button apple flex items-center justify-center h-12 w-12 rounded-full border border-theme-social-border bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-colors duration-200" aria-label="Login with Apple">
                            <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple" className="h-8 w-8" />
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <p className="mt-9 text-center text-sm text-theme-text flex-shrink-0">
                    Don't have an account?
                    <Link to="/signup" className="font-semibold text-brand-dark hover:underline transition-colors duration-200 ml-1">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}