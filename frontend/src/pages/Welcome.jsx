import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <--- Import Supabase
import logoImg from '../assets/logo.png';

export default function Welcome() {
  const navigate = useNavigate();

  // OPTIONAL: Auto-redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home'); // Skip welcome screen if user is remembered
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="antialiased h-[100dvh] w-full overflow-hidden bg-[#FDFBF7] flex justify-center relative font-sans">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-orange-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-amber-200/30 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md h-full flex flex-col px-6 py-6 md:py-10">
        
        <div className="flex-grow flex flex-col items-center justify-center animate-fade-in-up">
          
          <div className="w-48 md:w-64 transform transition hover:scale-105 duration-500">
             {/* Ensure logo.png is in your public folder */}
            <img 
              src={logoImg} 
              alt="BiteChoice Logo" 
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight text-center">
            Decide. Eat. Enjoy.
          </h2>
          <p className="mt-2 text-gray-500 text-center text-sm md:text-base max-w-xs mx-auto leading-relaxed">
            Discover your next meal in seconds.
          </p>
        </div>

        <div className="w-full flex-shrink-0 flex flex-col space-y-4 pb-4 md:pb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Main Action: Go to Login (or Signup flow) */}
          <Link to="/login" className="group relative flex w-full justify-center items-center rounded-2xl bg-brand-dark px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-dark/30 transition-all duration-300 hover:shadow-brand-dark/50 hover:-translate-y-1 active:scale-95">
            Let's get started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link to="/signup" className="flex w-full justify-center items-center rounded-2xl bg-white text-brand-dark border border-stone-100 px-6 py-4 text-lg font-semibold shadow-sm hover:bg-stone-50 active:scale-95 transition-transform">
            I already have an account
          </Link>

          <p className="text-xs text-gray-400 text-center mt-2 md:mt-4">
            By continuing, you agree to our 
            <a href="#" className="underline hover:text-orange-600 transition-colors ml-1">Terms</a> & 
            <a href="#" className="underline hover:text-orange-600 transition-colors ml-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );

}


