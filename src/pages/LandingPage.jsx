import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BookOpen, LayoutDashboard, AlertTriangle, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State untuk mengontrol buka/tutup menu hamburger
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = async () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      try {
        await loginWithGoogle();
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <>
      {/* 1. CSS KHUSUS UNTUK HIDE SCROLLBAR */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* 2. WRAPPER UTAMA */}
      <div className="min-h-screen w-full bg-dark-900 text-white font-sans selection:bg-accent-cyan selection:text-black overflow-x-hidden">
        
        {/* NAVBAR */}
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between relative z-50 bg-dark-900/80 backdrop-blur-md sticky top-0 border-b border-white/5">
          {/* Logo */}
          <div className="text-lg md:text-xl font-bold italic">Proteus <span className="text-accent-cyan">Guardian</span></div>
          
          {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden md:flex gap-6 items-center">
              <Link to="/about" className="text-gray-300 hover:text-white transition text-sm">About Us</Link>
              <Link to="/docs" className="text-gray-300 hover:text-white transition text-sm">Documentation</Link>
              {currentUser ? (
                   <Link to="/dashboard" className="text-accent-cyan font-bold text-sm">Go to Dashboard</Link>
              ) : (
                  <button onClick={handleGetStarted} className="px-4 py-2 bg-accent-cyan text-black font-bold text-sm rounded-lg hover:bg-cyan-400 transition">
                      Sign In
                  </button>
              )}
          </div>

          {/* --- MOBILE HAMBURGER BUTTON (Visible on Mobile) --- */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* --- MOBILE MENU DROPDOWN --- */}
        {/* Hanya muncul jika isMobileMenuOpen = true */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 w-full bg-dark-900 border-b border-dark-700 z-40 animate-in slide-in-from-top-5 duration-300 shadow-2xl">
            <div className="flex flex-col p-4 gap-4">
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-gray-300 hover:text-white transition text-lg py-2 border-b border-white/5"
              >
                About Us
              </Link>
              <Link 
                to="/docs" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-gray-300 hover:text-white transition text-lg py-2 border-b border-white/5"
              >
                Documentation
              </Link>
              
              <div className="pt-2">
                {currentUser ? (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-accent-cyan/10 text-accent-cyan font-bold rounded-lg border border-accent-cyan/50 hover:bg-accent-cyan/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                      handleGetStarted();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full px-4 py-3 bg-accent-cyan text-black font-bold rounded-lg hover:bg-cyan-400 transition"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20 px-4 relative pb-20">
          
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-cyan/20 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none"></div>

          <div className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-semibold tracking-wider text-accent-cyan uppercase bg-accent-cyan/10 rounded-full border border-accent-cyan/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Industrial IoT Solution
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 max-w-4xl tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Predict Machine Failures <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-600">Before They Happen</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl max-w-lg md:max-w-2xl mb-8 md:mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 px-2">
            Proteus Guardian uses advanced AI to analyze telemetry data, predict Remaining Useful Life (RUL), and automate maintenance reporting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <button 
                  onClick={handleGetStarted}
                  className="px-8 py-3 md:py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                  <LayoutDashboard size={20}/> Get Started
              </button>
              <Link 
                  to="/docs"
                  className="px-8 py-3 md:py-4 bg-dark-800 border border-dark-700 text-white font-bold rounded-full hover:bg-dark-700 transition flex items-center justify-center gap-2"
              >
                  <BookOpen size={20}/> Read Docs
              </Link>
          </div>

          {/* --- LIVE DASHBOARD PREVIEW --- */}
          <div className="mt-12 md:mt-20 w-full max-w-6xl mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-1000 delay-500 px-2 md:px-4">
            
            {/* Frame Laptop/Browser */}
            <div className="bg-dark-900 rounded-t-xl border border-dark-700 shadow-2xl shadow-cyan-500/20 overflow-hidden">
              
              {/* Browser Header */}
              <div className="bg-dark-800 px-4 py-3 border-b border-dark-700 flex gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50"></div>
              </div>

              {/* Isi Dashboard Mockup */}
              <div className="p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 bg-dark-900/95 backdrop-blur text-left">
                
                {/* SIDEBAR MINI (Hidden on Mobile/Tablet) */}
                <div className="hidden lg:flex lg:col-span-1 flex-col gap-4 items-center pt-2 border-r border-dark-700/50 pr-4">
                  <div className="w-8 h-8 bg-accent-cyan rounded-lg mb-4 shadow-lg shadow-cyan-500/50"></div>
                  <div className="w-8 h-8 bg-dark-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-dark-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-dark-700 rounded-lg"></div>
                </div>

                {/* CONTENT AREA */}
                <div className="col-span-1 lg:col-span-11 grid grid-cols-1 gap-4 md:gap-6">
                  
                  {/* TOP STATS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* STAT CARD 1: CRITICAL */}
                      <div className="bg-dark-800 p-4 rounded-xl border border-red-900/30 flex flex-col justify-between h-28 md:h-32 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><AlertTriangle size={60} className="text-red-500"/></div>
                        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Critical Assets</div>
                        <div className="text-2xl md:text-3xl font-bold text-white mt-1">3 <span className="text-xs md:text-sm text-red-400 font-normal">Machines</span></div>
                        <div className="text-[10px] md:text-xs text-red-400 flex items-center gap-1 mt-auto font-medium">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Action Required
                        </div>
                      </div>

                      {/* STAT CARD 2: RUL */}
                      <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col justify-between h-28 md:h-32">
                        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Avg. RUL Prediction</div>
                        <div className="text-2xl md:text-3xl font-bold text-white mt-1">124 <span className="text-xs md:text-sm text-accent-cyan font-normal">Hours</span></div>
                        <div className="w-full bg-dark-700 h-1.5 rounded-full mt-auto overflow-hidden">
                          <div className="bg-accent-cyan w-[70%] h-full rounded-full"></div>
                        </div>
                      </div>

                      {/* STAT CARD 3: AI ANALYSIS */}
                      <div className="bg-gradient-to-br from-indigo-900/40 to-dark-800 p-4 rounded-xl border border-indigo-500/30 flex flex-col justify-between h-28 md:h-32 sm:col-span-2 lg:col-span-1">
                        <div className="text-indigo-300 text-[10px] md:text-xs font-bold uppercase flex items-center gap-2">
                            ✨ AI Insight
                        </div>
                        <div className="text-xs md:text-sm text-white font-medium leading-tight mt-2">
                          "Anomaly detected on <span className="text-accent-cyan">Motor A-101</span>. 85% probability of bearing failure."
                        </div>
                      </div>
                  </div>

                  {/* BOTTOM ROW: CHART & LOGS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                      
                      {/* MAIN CHART AREA */}
                      <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700 p-3 md:p-4 h-56 md:h-64 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-xs md:text-sm font-bold text-white">Live Vibration Telemetry</div>
                          <div className="text-[10px] md:text-xs text-green-400 px-2 py-1 bg-green-900/20 rounded border border-green-900/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live
                          </div>
                        </div>
                        <div className="flex-1 flex items-end gap-1 px-1 md:px-2 pb-2 opacity-80 border-b border-dark-600">
                          {[30, 45, 60, 45, 70, 80, 50, 60, 90, 120, 150, 100, 80, 60, 50, 40, 30, 80, 100, 140, 110, 90, 70, 50, 60, 40, 30].map((h, i) => (
                              <div key={i} style={{height: `${Math.min(100, (h/150)*100)}%`}} className={`flex-1 rounded-t-[2px] transition-all duration-500 ${h > 100 ? 'bg-red-500' : 'bg-accent-cyan'}`}></div>
                          ))}
                        </div>
                        <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-dark-600/30 pointer-events-none"></div>
                      </div>

                      {/* LIST LOGS */}
                      <div className="lg:col-span-1 bg-dark-800 rounded-xl border border-dark-700 p-3 md:p-4 h-56 md:h-64 overflow-hidden flex flex-col">
                        <div className="text-xs md:text-sm font-bold text-white mb-3">Recent Alerts</div>
                        <div className="space-y-2 md:space-y-3 overflow-y-auto pr-1 scrollbar-hide">
                          {[
                            {id: 'M-101', msg: 'Overheating Warning', time: '2m ago', color: 'text-red-400', bg: 'bg-red-400/10'},
                            {id: 'M-202', msg: 'Vibration Spike', time: '15m ago', color: 'text-yellow-400', bg: 'bg-yellow-400/10'},
                            {id: 'M-303', msg: 'Pressure Drop', time: '1h ago', color: 'text-gray-400', bg: 'bg-gray-400/10'},
                            {id: 'M-104', msg: 'Sensor Offline', time: '2h ago', color: 'text-gray-400', bg: 'bg-gray-400/10'},
                          ].map((log, i) => (
                              <div key={i} className="flex justify-between items-start text-[10px] md:text-xs p-2 rounded-lg hover:bg-dark-700/50 transition-colors">
                                <div className="flex gap-2">
                                    <div className={`w-1 h-full rounded-full ${log.color.replace('text', 'bg')}`}></div>
                                    <div>
                                      <span className="font-bold text-white block">{log.id}</span>
                                      <span className={log.color}>{log.msg}</span>
                                    </div>
                                </div>
                                <span className="text-gray-600 whitespace-nowrap">{log.time}</span>
                              </div>
                          ))}
                        </div>
                      </div>

                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-accent-cyan/30 blur-[50px] rounded-full z-[-1]"></div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LandingPage;