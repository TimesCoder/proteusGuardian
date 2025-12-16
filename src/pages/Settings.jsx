// File: src/pages/Settings.jsx (FINAL - INTEGRASI MLOPS)

import React, { useState } from 'react';
import { Save, User, Bell, Shield, Globe, Loader2, AlertTriangle, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- IMPORT KOMPONEN MLOPS & DEBUGGING ---
// Pastikan path ini benar sesuai struktur folder Anda
import RetrainControl from '../components/RetrainControl'; 
import MLTester from '../components/MLTester'; 

// Komponen Toggle Switch Custom
const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
      <span className="text-gray-300 text-sm">{label}</span>
      <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 focus:outline-none ${
          checked ? 'bg-accent-cyan' : 'bg-dark-600'
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}></div>
      </button>
    </div>
);


const Settings = () => {
  // --- STATE ---
  // 1. State Notifikasi
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    criticalAlerts: true,
    weeklyReport: true
  });

  // 2. State Loading Tombol Save
  const [isSaving, setIsSaving] = useState(false);

  // 3. State Modal Reset (Danger Zone)
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // State Profile (Tambahan)
  const [profile, setProfile] = useState({
    fullName: "Admin User",
    email: "admin@gmail.com"
  });


  // --- LOGIC HANDLERS ---
  const handleSave = () => {
    setIsSaving(true);
    
    // Tampilkan loading toast
    const loadingToast = toast.loading('Menyimpan pengaturan...');

    // Simulasi API Call
    setTimeout(() => {
      setIsSaving(false);
      
      // Ubah loading jadi sukses
      toast.dismiss(loadingToast);
      toast.success('Pengaturan berhasil disimpan!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    }, 1500);
  };

  const handleConfirmReset = () => {
    setIsResetting(true); 
    
    // Simulasi Reset System
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false); 
      alert("⚠️ SYSTEM RESET: Semua data telah dikembalikan ke pengaturan pabrik.");
      // Reload halaman untuk refresh state aplikasi
      window.location.reload(); 
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto relative">
      <Toaster/>
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Manage user, system, and MLOps preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 font-bold text-sm rounded-lg transition shadow-neon-cyan ${
             isSaving ? 'bg-dark-700 text-gray-400 cursor-not-allowed' : 'bg-accent-cyan text-black hover:bg-cyan-400 active:scale-95'
          }`}
        >
          {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (PROFILE & USER DETAILS) */}
        <div className="space-y-6">
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-purple to-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-dark-900 shadow-lg">
              <User size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
            <p className="text-sm text-gray-400">Head Engineer</p>
          </div>
          
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><User size={18} className="text-accent-cyan"/> Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Full Name</label>
                <input 
                  type="text" 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-white text-sm focus:border-accent-cyan focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-white text-sm focus:border-accent-cyan focus:outline-none transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SYSTEM, NOTIFICATIONS, MLOPS) */}
        <div className="lg:col-span-2 space-y-6">
            
          {/* NOTIFICATIONS */}
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-accent-purple"/> Notifications</h3>
            <div className="space-y-1">
              <Toggle label="Email Alerts for Critical Errors" checked={notifications.criticalAlerts} onChange={() => setNotifications({...notifications, criticalAlerts: !notifications.criticalAlerts})} />
              <Toggle label="Weekly Performance Report (PDF)" checked={notifications.weeklyReport} onChange={() => setNotifications({...notifications, weeklyReport: !notifications.weeklyReport})} />
              <Toggle label="SMS Notifications (Mobile)" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} />
            </div>
          </div>

          {/* SECURITY & SYSTEM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-accent-success"/> Security</h3>
                    <button className="w-full text-left py-2.5 px-3 bg-dark-900 hover:bg-dark-700 rounded-lg text-sm text-gray-300 mb-2 transition">Change Password</button>
                    <button className="w-full text-left py-2.5 px-3 bg-dark-900 hover:bg-dark-700 rounded-lg text-sm text-gray-300 transition">Enable 2FA</button>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-400"/> System</h3>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Timezone</label>
                        <select className="w-full bg-dark-900 border border-dark-600 rounded text-white text-sm p-2.5 focus:border-blue-400 outline-none">
                            <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                            <option>(GMT+08:00) Singapore</option>
                            <option>(GMT+00:00) UTC</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>

          {/* MLOPS & ML TESTER (New Features) */}
          <div className="space-y-6">
              {/* 1. MLOPS: RETRAIN CONTROL */}
              <RetrainControl />
              
              {/* 2. DEBUGGING: ML INFERENCE TESTER */}
              <MLTester />
          </div>
          
          {/* DANGER ZONE */}
          <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl mt-8">
              <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /> Danger Zone
              </h3>
              <p className="text-xs text-gray-400 mb-4">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowResetModal(true)} 
                  className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white rounded-lg text-sm transition font-semibold"
                >
                  Reset Factory Settings
                </button>
              </div>
          </div>

        </div>
      </div>

      {/* --- MODAL KONFIRMASI RESET (POP-UP) --- */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-red-900/50 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-900/20 rounded-full">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-gray-500 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Are you absolutely sure?</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This action will wipe all local data, clear database connections, and reset the dashboard to its initial state.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
              >
                {isResetting ? (
                  <> <Loader2 size={18} className="animate-spin" /> Resetting... </>
                ) : (
                  "Yes, Reset System"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  
  );}


export default Settings;