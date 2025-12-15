// File: components/FeedbackForm.jsx

import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle, Loader2, Target, Zap } from 'lucide-react';

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

    const handleSubmitFeedback = async () => {
        if (!liveSensorData || !machineId || isLoading) return;

        const confirmation = window.confirm(
            `CONFIRM: Kirim data feedback untuk ${machineId} dengan actual failure: ${actualFailure}?`
        );
        if (!confirmation) return;

        setIsLoading(true);
        setStatus(null);

        try {
            // Kita harus mengirim data sensor sesuai skema SensorData di backend
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
            alert(`✅ Feedback berhasil disimpan untuk ${machineId}! Data akan digunakan untuk retrain model.`);

        } catch (error) {
            setStatus('error');
            console.error("Feedback Submission Error:", error);
            alert(`❌ Gagal menyimpan feedback: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
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