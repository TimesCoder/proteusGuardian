import React from 'react';
import { Wrench, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMachineData } from '../hooks/useMachineData';

// --- UTILITY: MENCARI TIKET PRIORITAS TERTINGGI ---
const findTopRecommendation = (tickets) => {
    // 1. Cek jika tiket kosong
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        return null;
    }

    // 2. Filter hanya yang Critical atau Warning
    const urgentTickets = tickets.filter(t => 
        t.risk_level === 'CRITICAL' || t.risk_level === 'WARNING'
    );

    if (urgentTickets.length === 0) {
        return null;
    }

    // 3. Sorting: Prioritas Critical > Warning, lalu berdasarkan Waktu Terbaru
    urgentTickets.sort((a, b) => {
        const riskPriority = { 'CRITICAL': 2, 'WARNING': 1 };
        
        // Bandingkan Risk Level dulu
        if (riskPriority[a.risk_level] !== riskPriority[b.risk_level]) {
            // Descending (2 > 1)
            return riskPriority[b.risk_level] - riskPriority[a.risk_level];
        }
        
        // Jika Risk sama, bandingkan timestamp (Terbaru di atas)
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Ambil yang paling atas
    return urgentTickets[0];
};

const MaintenanceRecommendation = () => {
    const { data, loading, error } = useMachineData();

    // Safety check: Pastikan mengambil array tickets dari object data
    const tickets = data?.tickets || [];

    if (loading) {
        return (
            <div className="bg-dark-800 p-6 rounded-xl flex items-center justify-center border border-dark-700 h-full min-h-[300px]">
                <Loader2 className="animate-spin text-accent-cyan mr-2" />
                <span className="text-gray-400">Menganalisis Data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/10 text-red-400 p-6 rounded-xl border border-red-700 flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle size={32} className="mb-2" />
                <p>Gagal memuat data rekomendasi.</p>
            </div>
        );
    }

    const topRec = findTopRecommendation(tickets);

    // --- TAMPILAN JIKA AMAN (TIDAK ADA REKOMENDASI) ---
    if (!topRec) {
        return (
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-green-900/20 rounded-full mb-4">
                    <CheckCircle className="text-accent-success" size={48} />
                </div>
                <h3 className="text-xl font-bold text-white">Sistem Optimal</h3>
                <p className="text-gray-400 text-sm mt-2">Tidak ada anomali kritis yang memerlukan tindakan segera.</p>
            </div>
        );
    }

    // Persiapan Teks Rekomendasi
    // Prioritaskan ai_analysis, lalu recommendation, lalu default text
    const recommendationText = topRec.ai_analysis || topRec.recommendation || "Lakukan inspeksi mendalam pada komponen terkait.";

    // --- TAMPILAN JIKA ADA REKOMENDASI (CRITICAL/WARNING) ---
    return (
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-xl h-full flex flex-col">
            
            {/* Header Icon */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className={`p-3 rounded-full ${topRec.risk_level === 'CRITICAL' ? 'bg-red-900/30' : 'bg-accent-purple/20'}`}>
                    <Wrench className={`${topRec.risk_level === 'CRITICAL' ? 'text-red-500' : 'text-accent-purple'}`} size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mt-3 text-center">Tindakan Diperlukan</h2>
                <p className="text-sm text-gray-400">Berdasarkan analisis prediktif AI</p>
            </div>

            {/* Content Box */}
            <div className="bg-dark-900 p-5 rounded-xl relative border border-dark-700 flex-1 flex flex-col justify-center">

                {/* Badge Status Risiko */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        topRec.risk_level === 'CRITICAL' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-yellow-600 text-black shadow-lg shadow-yellow-900/50'
                    }`}>
                        {topRec.risk_level}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-white mb-5 pt-2 border-b border-dark-700 pb-2">
                    Prioritas Utama
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Baris 1: Identitas */}
                    <RecDetail title="Mesin ID" value={topRec.machine_id} highlight />
                    <RecDetail title="Jenis Kegagalan" value={topRec.failure_type} />
                    
                    {/* Baris 2: Komponen & Waktu */}
                    <RecDetail title="Waktu Deteksi" value={new Date(topRec.timestamp).toLocaleDateString()} />
                    <RecDetail title="Komponen (Prediksi)" value="Motor / Bearing" />

                    {/* Baris 3: Rekomendasi (FULL WIDTH agar terbaca) */}
                    <div className="col-span-2 mt-2">
                        <div className="p-3 bg-dark-700 rounded-lg border border-dark-600">
                            <p className="text-xs text-accent-cyan uppercase font-bold mb-2 flex items-center gap-2">
                                <Wrench size={12} /> Rekomendasi AI
                            </p>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                {recommendationText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-komponen Detail Kecil
const RecDetail = ({ title, value, highlight = false }) => (
    <div className="p-3 bg-dark-700 rounded-lg border border-dark-800">
        <p className="text-xs text-gray-400 mb-1 uppercase">{title}</p>
        <p className={`text-sm font-semibold truncate ${highlight ? 'text-accent-cyan' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

export default MaintenanceRecommendation;