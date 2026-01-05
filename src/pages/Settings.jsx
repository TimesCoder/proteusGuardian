import React, { useState } from "react";
import {
  Save,
  User,
  Bell,
  Shield,
  Globe,
  Loader2,
  AlertTriangle,
  X,
  LogOut,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

import { useAuth } from "../context/AuthContext";

import RetrainControl from "../components/RetrainControl";
import MLTester from "../components/MLTester";

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
    <span className="text-gray-300 text-sm">{label}</span>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 focus:outline-none ${
        checked ? "bg-accent-cyan" : "bg-dark-600"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      ></div>
    </button>
  </div>
);

const Settings = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    criticalAlerts: true,
    weeklyReport: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [profile, setProfile] = useState({
    fullName: currentUser?.displayName || "Admin User", 
    email: currentUser?.email || "admin@proteus.com",
  });

  const handleSave = () => {
    setIsSaving(true);
    const loadingToast = toast.loading("Menyimpan pengaturan...");
    setTimeout(() => {
      setIsSaving(false);
      toast.dismiss(loadingToast);
      toast.success("Pengaturan berhasil disimpan!");
    }, 1500);
  };

  const handleConfirmReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false);
      alert("⚠️ SYSTEM RESET: Data dikembalikan ke pengaturan pabrik.");
      window.location.reload();
    }, 2000);
  };


  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); 
      toast.success("Berhasil keluar 👋");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Gagal logout");
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto relative">
      <Toaster position="top-center" />

      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">
            Manage user, system, and MLOps preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 font-bold text-sm rounded-lg transition shadow-neon-cyan ${
            isSaving
              ? "bg-dark-700 text-gray-400 cursor-not-allowed"
              : "bg-accent-cyan text-black hover:bg-cyan-400 active:scale-95"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI (PROFILE & USER DETAILS) */}
        <div className="space-y-6">
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-purple to-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-dark-900 shadow-lg overflow-hidden">
              {/* Gunakan foto profil Google jika ada, fallback ke Icon User */}
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
            <p className="text-sm text-gray-400">Head Engineer</p>
          </div>

          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-accent-cyan" /> Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-white text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled // Email firebase biasanya read-only disini
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/*TOMBOL LOGOUT*/}
            <div className="mt-8 pt-6 border-t border-dark-700">
              <button
                onClick={handleLogoutClick} 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-900 hover:bg-red-900/10 text-gray-300 hover:text-red-400 border border-dark-600 hover:border-red-500/30 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-red-900/20"
              >
                <div className="p-1.5 bg-dark-800 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <LogOut
                    size={18}
                    className="group-hover:-translate-x-0.5 transition-transform text-gray-400 group-hover:text-red-400"
                  />
                </div>
                <span className="font-semibold tracking-wide">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SYSTEM, NOTIFICATIONS, MLOPS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* NOTIFICATIONS */}
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Bell size={18} className="text-accent-purple" /> Notifications
            </h3>
            <div className="space-y-1">
              <Toggle
                label="Email Alerts for Critical Errors"
                checked={notifications.criticalAlerts}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    criticalAlerts: !notifications.criticalAlerts,
                  })
                }
              />
              <Toggle
                label="Weekly Performance Report (PDF)"
                checked={notifications.weeklyReport}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    weeklyReport: !notifications.weeklyReport,
                  })
                }
              />
              <Toggle
                label="SMS Notifications (Mobile)"
                checked={notifications.sms}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    sms: !notifications.sms,
                  })
                }
              />
            </div>
          </div>

          {/* SECURITY & SYSTEM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-accent-success" /> Security
                </h3>
                <button className="w-full text-left py-2.5 px-3 bg-dark-900 hover:bg-dark-700 rounded-lg text-sm text-gray-300 mb-2 transition">
                  Change Password
                </button>
                <button className="w-full text-left py-2.5 px-3 bg-dark-900 hover:bg-dark-700 rounded-lg text-sm text-gray-300 transition">
                  Enable 2FA
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-blue-400" /> System
                </h3>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Timezone
                  </label>
                  <select className="w-full bg-dark-900 border border-dark-600 rounded text-white text-sm p-2.5 focus:border-blue-400 outline-none">
                    <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option>(GMT+08:00) Singapore</option>
                    <option>(GMT+00:00) UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* MLOPS & ML TESTER */}
          <div className="space-y-6">
            <RetrainControl />
            <MLTester />
          </div>

          {/* DANGER ZONE */}
          <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl mt-8">
            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Danger Zone
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
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

      {/* --- MODAL KONFIRMASI RESET --- */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-red-900/50 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-900/20 rounded-full">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Are you absolutely sure?
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This action will wipe all local data, clear database connections,
              and reset the dashboard to its initial state.
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
                  <>
                    {" "}
                    <Loader2
                      size={18}
                      className="animate-spin"
                    /> Resetting...{" "}
                  </>
                ) : (
                  "Yes, Reset System"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        {/* Modal Container */}
        <div className="bg-dark-800 border border-dark-600 w-full max-w-sm rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Dekorasi Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-gradient-to-br from-dark-700 to-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-dark-600 shadow-inner">
                    <LogOut size={28} className="text-red-500 ml-1" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Signing Out?</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    You will need to enter your credentials again to access the dashboard.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowLogoutModal(false)}
                        disabled={isLoggingOut}
                        className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors border border-transparent hover:border-dark-500"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={confirmLogout}
                        disabled={isLoggingOut}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                    >
                        {isLoggingOut ? (
                            <><Loader2 size={18} className="animate-spin" /> Bye...</>
                        ) : (
                            "Yes, Sign Out"
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
    </div>
  );
};

export default Settings;
