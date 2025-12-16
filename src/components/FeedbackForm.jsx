// File: components/FeedbackForm.jsx

import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle, Loader2, Target, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CONFIG } from '../config';

// URL Feedback API
const FEEDBACK_API_URL = CONFIG.ENDPOINTS.ADMIN_FEEDBACK;

// Tipe kegagalan dari skema ML Anda
const FAILURE_TYPES = [
    'No Failure',
    'Power Failure',
    'Tool Wear Failure',
    'Overstrain Failure',
    'Heat Dissipation Failure'
];

/**
 * @param {object} liveSensorData - Data sensor live untuk dikirim sebagai input_data
 * @param {string} machineId - ID mesin
 */
const FeedbackForm = ({ liveSensorData, machineId }) => {
    const [actualFailure, setActualFailure] = useState(FAILURE_TYPES[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null

    const handleSubmitFeedback = () => {
    // Validasi awal
    if (!liveSensorData || !machineId || isLoading) return;

    // 1. Tampilkan Toast Konfirmasi Custom (Pengganti window.confirm)
    toast((t) => (
        <div className="flex flex-col gap-3 min-w-[320px]">
            <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                    <h4 className="font-bold text-white">Konfirmasi Feedback</h4>
                    <p className="text-sm text-gray-400 mt-1">
                        Kirim data untuk mesin <span className="font-mono text-accent-cyan">{machineId}</span>?
                    </p>
                    <p className="text-xs text-gray-200 mt-1 bg-dark-900 p-1 rounded border border-dark-700">
                        Label: <span className="text-white font-bold">{actualFailure}</span>
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-2">
                <button 
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 text-xs text-gray-300 bg-dark-700 hover:bg-dark-600 rounded border border-dark-600 transition"
                >
                    Batal
                </button>
                <button 
                    onClick={() => {
                        toast.dismiss(t.id); // Tutup dialog
                        submitFeedbackToAPI(); // Jalankan fungsi kirim
                    }}
                    className="px-3 py-1.5 text-xs bg-accent-cyan text-black font-bold rounded hover:bg-cyan-400 transition"
                >
                    Ya, Kirim Data
                </button>
            </div>
        </div>
    ), {
        duration: Infinity, // Agar toast tidak hilang sampai user memilih
        position: 'top-center',
        style: {
            background: '#1F2937',
            border: '1px solid #4B5563',
            color: '#fff',
        },
    });
};

// --- Fungsi Terpisah untuk API Call ---
const submitFeedbackToAPI = async () => {
    setIsLoading(true);
    setStatus(null);

    // 2. Mulai Loading Toast
    const loadingToast = toast.loading("Mengirim data feedback...", {
        style: { background: '#1F2937', color: '#fff' }
    });

    try {
        const payload = {
            input_data: {
                machine_id: machineId,
                air_temp_k: liveSensorData.air_temp_k,
                process_temp_k: liveSensorData.process_temp_k,
                rpm: liveSensorData.rpm,
                torque_nm: liveSensorData.torque_nm,
                tool_wear_min: liveSensorData.tool_wear_min,
                type: liveSensorData.type,
            },
            actual_failure: actualFailure,
        };

        const response = await fetch(FEEDBACK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.detail || `HTTP Error ${response.status}`);
        }

        setStatus('success');

        // 3. Ubah Loading jadi SUKSES (Pengganti alert sukses)
        toast.success("Feedback tersimpan! Model akan belajar dari data ini.", {
            id: loadingToast,
            duration: 4000,
            icon: '✅'
        });

    } catch (error) {
        setStatus('error');
        console.error("Feedback Submission Error:", error);

        // 4. Ubah Loading jadi ERROR (Pengganti alert error)
        toast.error(`Gagal: ${error.message}`, {
            id: loadingToast,
            duration: 4000
        });
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target size={16} className="text-yellow-400" /> MLOps Feedback Loop
            </h3>

            <p className="text-xs text-gray-400 mb-4">
                Koreksi prediksi AI dengan mencatat kegagalan aktual yang terjadi.
            </p>

            <div className="space-y-3">
                <label className="block text-xs text-gray-400 uppercase">Actual Failure Type</label>
                <select
                    value={actualFailure}
                    onChange={(e) => setActualFailure(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2 text-white text-sm focus:border-yellow-400 focus:outline-none"
                    disabled={isLoading}
                >
                    {FAILURE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <button
                    onClick={handleSubmitFeedback}
                    disabled={isLoading || !liveSensorData}
                    className={`w-full py-2 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm ${isLoading
                            ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-black active:scale-95'
                        }`}
                >
                    {isLoading ? (
                        <> <Loader2 size={18} className="animate-spin" /> Submitting... </>
                    ) : (
                        <> <Zap size={18} /> Submit Feedback </>
                    )}
                </button>
            </div>

            {status === 'success' && (
                <p className="mt-3 text-xs text-accent-success flex items-center gap-1">
                    <CheckCircle size={14} /> Data feedback berhasil dikirim.
                </p>
            )}
            {status === 'error' && (
                <p className="mt-3 text-xs text-accent-danger flex items-center gap-1">
                    <AlertTriangle size={14} /> Gagal menyimpan feedback.
                </p>
            )}
        </div>
    );
};

export default FeedbackForm;