// File: src/components/MLTester.jsx (FINAL - ROBUST ERROR HANDLING)

import React, { useState } from 'react';
import { Play, Loader2, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { CONFIG } from '../config';

// Pastikan endpoint ini sesuai dengan config.js Anda
const PREDICT_API_URL = CONFIG.ENDPOINTS?.ML_PREDICT || `${CONFIG.API_BASE_URL}/api/ml/predict`;

const initialInput = {
    machine_id: 'TEST-001',
    air_temp_k: 300.0,
    process_temp_k: 308.0,
    rpm: 1500,
    torque_nm: 45.0,
    tool_wear_min: 50,
    type: 'M',
};

const MLTester = () => {
    const [inputData, setInputData] = useState(initialInput);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setInputData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        }));
    };

    const handlePredict = async () => {
        setIsLoading(true);
        setPrediction(null);
        setError(null);

        try {
            // 1. Validasi Input Frontend
            for (const key in inputData) {
                if (inputData[key] === '' || inputData[key] === null || inputData[key] === undefined) {
                    throw new Error(`Field '${key.replace(/_/g, ' ')}' tidak boleh kosong.`);
                }
            }

            // 2. Kirim Request
            const response = await fetch(PREDICT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData),
            });

            // 3. Handling Response (JSON vs Text/HTML)
            const contentType = response.headers.get("content-type");
            
            if (!response.ok) {
                // Jika error JSON (valid dari API)
                if (contentType && contentType.includes("application/json")) {
                    const errorJson = await response.json();
                    throw new Error(errorJson.detail || errorJson.message || `API Error ${response.status}`);
                } 
                // Jika error HTML/Text (Server Crash / 500 / 404)
                else {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 60)}...`); 
                }
            }

            const data = await response.json();
            setPrediction(data);

        } catch (err) {
            setError(err.message);
            console.error("Prediction Failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatLabel = (key) => {
        const labels = {
            air_temp_k: "Air Temp (K)",
            process_temp_k: "Process Temp (K)",
            rpm: "RPM",
            torque_nm: "Torque (Nm)",
            tool_wear_min: "Tool Wear (min)",
            machine_id: "Machine ID",
            type: "Type (L/M/H)"
        };
        return labels[key] || key.replace(/_/g, ' ');
    };

    const isHighRisk = prediction?.risk_probability > 0.5;
    const riskColorClass = isHighRisk ? 'text-accent-danger' : 'text-accent-success';

    return (
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={18} className="text-accent-cyan" /> ML Inference Tester
            </h3>

            <p className="text-sm text-gray-400 mb-6">
                Uji model ML secara langsung dengan memasukkan parameter sensor manual.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.keys(initialInput).map(key => (
                    <div key={key} className={key === 'machine_id' ? 'col-span-2' : ''}>
                        <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase">
                            {formatLabel(key)}
                        </label>
                        <input
                            type={key === 'type' || key === 'machine_id' ? 'text' : 'number'}
                            name={key}
                            value={inputData[key]}
                            onChange={handleChange}
                            step={key.includes('temp') || key.includes('torque') ? "0.1" : "1"}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-white text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full py-3 bg-accent-cyan hover:bg-cyan-400 text-black rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-neon-cyan active:scale-95"
            >
                {isLoading ? (
                    <> <Loader2 size={18} className="animate-spin" /> Analyzing... </>
                ) : (
                    <> <Play size={18} /> Run Prediction </>
                )}
            </button>

            {/* Output Hasil */}
            {prediction && (
                <div className={`mt-6 p-4 rounded-xl border space-y-2 animate-in fade-in slide-in-from-bottom-2 ${isHighRisk ? 'bg-red-900/10 border-red-900/50' : 'bg-green-900/10 border-green-900/50'}`}>
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${riskColorClass}`}>
                        {isHighRisk ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                        Prediction Result
                    </h4>
                    
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Risk Probability:</span>
                            <span className={`font-mono font-bold ${riskColorClass}`}>
                                {(prediction.risk_probability * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Condition:</span>
                            <span className="text-white font-medium">{prediction.condition}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Output Error */}
            {error && (
                <div className="mt-6 p-3 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle size={18} className="shrink-0" /> 
                    {/* Tampilkan pesan error yang sudah diproses */}
                    <span className="break-all">{error}</span>
                </div>
            )}
        </div>
    );
};

export default MLTester;