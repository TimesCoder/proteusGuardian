import React, { useState } from 'react';
import { Loader2, Zap, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';

// Pastikan endpoint ini sesuai dengan config.js Anda
const MONOLITH_ADMIN_API_URL = CONFIG.ENDPOINTS?.ADMIN_RETRAIN || `${CONFIG.API_BASE_URL}/api/admin/retrain`;

const RetrainControl = () => {
    const [isRetraining, setIsRetraining] = useState(false);
    const [status, setStatus] = useState({ message: "Ready to retrain model.", color: "text-gray-400" });

    // Dummy count untuk UX, idealnya diambil dari API /api/admin/feedback/count
    const [feedbackCount] = useState(Math.floor(Math.random() * 20) + 5); 

    const handleRetrain = async () => {
        if (isRetraining) return;

        const confirmation = window.confirm(
            `⚠️ CONFIRM RETRAIN:\n\nAnda yakin ingin memicu pelatihan ulang model ML? Proses ini akan menggunakan data feedback baru yang terkumpul.`
        );

        if (!confirmation) return;

        setIsRetraining(true);
        setStatus({ message: "Model retraining started...", color: "text-accent-warning" });

        try {
            const response = await fetch(MONOLITH_ADMIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (response.ok && data.status === 'Success') {
                // Ekstrak angka sampel secara aman menggunakan Optional Chaining
                const sampleCountMatch = data.message?.match(/\d+/);
                const sampleCount = sampleCountMatch ? sampleCountMatch[0] : 'multiple';

                setStatus({
                    message: `✅ Success! Retrained on ${sampleCount} samples. Anomalies found: ${data.anomalies_in_feedback}.`,
                    color: "text-accent-success"
                });
            } else if (response.ok && data.message?.includes('No feedback')) {
                setStatus({
                    message: "⚠️ No new feedback data available to retrain.",
                    color: "text-yellow-500"
                });
            } else {
                throw new Error(data.detail || "Unknown API Error during retrain.");
            }

        } catch (error) {
            setStatus({
                message: `❌ Retrain Failed: ${error.message}`,
                color: "text-accent-danger"
            });
            console.error("Retrain Error:", error);
        } finally {
            setIsRetraining(false);
        }
    };

    return (
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex flex-col justify-between">
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