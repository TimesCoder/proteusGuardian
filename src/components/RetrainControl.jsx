import React, { useState } from 'react';
import { Loader2, Zap, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';
import toast, { Toaster } from 'react-hot-toast';

// Pastikan endpoint ini sesuai dengan config.js Anda
const MONOLITH_ADMIN_API_URL = CONFIG.ENDPOINTS?.ADMIN_RETRAIN || `${CONFIG.API_BASE_URL}/api/admin/retrain`;

const RetrainControl = () => {
    const [isRetraining, setIsRetraining] = useState(false);
    const [status, setStatus] = useState({ message: "Ready to retrain model.", color: "text-gray-400" });

    // Dummy count untuk UX, idealnya diambil dari API /api/admin/feedback/count
    const [feedbackCount] = useState(Math.floor(Math.random() * 20) + 5); 

    const handleRetrain = () => {
    // 1. Cegah spam klik
    if (isRetraining) return;

    // 2. Tampilkan Konfirmasi Custom (Bukan window.confirm)
    toast((t) => (
        <div className="flex flex-col gap-3 min-w-[300px]">
            <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                    <h4 className="font-bold text-white">Konfirmasi Retrain</h4>
                    <p className="text-sm text-gray-400 mt-1">
                        Proses ini menggunakan data feedback baru. Lanjutkan?
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-2">
                <button 
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 text-xs text-gray-300 bg-dark-700 hover:bg-dark-600 rounded transition"
                >
                    Batal
                </button>
                <button 
                    onClick={() => {
                        toast.dismiss(t.id); // Tutup konfirmasi
                        executeRetrain();    // Jalankan fungsi API
                    }}
                    className="px-3 py-1.5 text-xs bg-accent-warning text-black font-bold rounded hover:bg-yellow-500 transition"
                >
                    Ya, Mulai Training
                </button>
            </div>
        </div>
    ), {
        duration: Infinity, // Agar tidak hilang sendiri sampai diklik
        position: 'top-center',
        style: {
            background: '#1F2937',
            border: '1px solid #4B5563',
            color: '#fff',
        },
    });
};

// --- FUNGSI UTAMA (Dipisahkan agar rapi) ---
const executeRetrain = async () => {
    setIsRetraining(true);
    
    // Tampilkan Loading Toast
    const loadingToast = toast.loading("Sedang melatih ulang model...", {
        style: { background: '#1F2937', color: '#fff' }
    });

    try {
        const response = await fetch(MONOLITH_ADMIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        // LOGIC SUKSES
        if (response.ok && data.status === 'Success') {
            const sampleCountMatch = data.message?.match(/\d+/);
            const sampleCount = sampleCountMatch ? sampleCountMatch[0] : 'multiple';

            // Update Toast jadi Sukses
            toast.success(`Berhasil! Melatih ${sampleCount} sampel baru.`, {
                id: loadingToast, // Menggantikan loading toast
                duration: 4000,
                icon: '🚀',
            });
            
            // Opsional: Update state text di UI jika masih perlu
            setStatus({ 
                message: `✅ Success! Anomalies: ${data.anomalies_in_feedback}`, 
                color: "text-accent-success" 
            });

        // LOGIC NO FEEDBACK
        } else if (response.ok && data.message?.includes('No feedback')) {
            toast("Tidak ada data feedback baru.", {
                id: loadingToast,
                icon: 'ℹ️',
                style: { background: '#1F2937', color: '#fbbf24' } // Yellow text
            });
            
            setStatus({ message: "⚠️ No new data.", color: "text-yellow-500" });

        // LOGIC API ERROR
        } else {
            throw new Error(data.detail || "Respon server tidak valid.");
        }

    } catch (error) {
        // Update Toast jadi Error
        toast.error(`Gagal: ${error.message}`, {
            id: loadingToast,
            duration: 4000
        });
        console.error("Retrain Error:", error);
        
        setStatus({ message: "❌ Retrain Failed", color: "text-accent-danger" });
    } finally {
        setIsRetraining(false);
    }
};

    return (
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex flex-col justify-between">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-accent-warning" /> MLOps: Model Retraining
                </h3>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Trigger pipeline pelatihan ulang (retraining) model deteksi anomali menggunakan data <i>feedback loop</i> terbaru.
                </p>

                <div className="mb-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700 text-sm flex justify-between items-center">
                    <span className="text-gray-400">Feedback Data Buffer:</span>
                    <span className="text-white font-mono font-bold bg-dark-700 px-2 py-1 rounded">
                        ~{feedbackCount} records
                    </span>
                </div>
            </div>

            <div>
                <div className={`text-xs font-medium mb-3 p-2 rounded bg-dark-900 border border-dark-700 min-h-[40px] flex items-center ${status.color}`}>
                    {status.message}
                </div>

                <button
                    onClick={handleRetrain}
                    disabled={isRetraining}
                    className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-lg ${isRetraining
                            ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
                            : 'bg-accent-purple hover:bg-purple-600 text-white active:scale-95 shadow-purple-900/20'
                        }`}
                >
                    {isRetraining ? (
                        <> <Loader2 size={18} className="animate-spin" /> Retraining... </>
                    ) : (
                        <> <RefreshCw size={18} /> Run Retrain Pipeline </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RetrainControl;