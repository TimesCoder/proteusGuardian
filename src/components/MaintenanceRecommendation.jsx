// File: src/components/MaintenanceRecommendation.jsx

import React from 'react';
import { Wrench, Loader2, AlertTriangle, CheckCircle, Activity, Clock, Zap } from 'lucide-react';
import { useMachineData } from '../hooks/useMachineData';

// --- UTILITY: MAPPING KOMPONEN DINAMIS ---
const mapComponentToFailure = (failureType) => {
    const type = failureType?.toLowerCase() || '';

    if (type.includes('power')) return 'Power Supply / PSU';
    if (type.includes('tool') || type.includes('wear')) return 'Cutting Tool / Drill Bit';
    if (type.includes('overstrain') || type.includes('torque')) return 'Spindle / Gearbox';
    if (type.includes('heat') || type.includes('dissipation') || type.includes('overheat')) return 'Cooling System / Fan';
    if (type.includes('random')) return 'Software / Controller';
    
    return 'Main Motor Assembly';
};

// --- UTILITY: MENCARI TIKET PRIORITAS TERTINGGI ---
const findTopRecommendation = (tickets) => {
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) return null;

    const urgentTickets = tickets.filter(t => 
        t.risk_level === 'CRITICAL' || t.risk_level === 'WARNING'
    );

    if (urgentTickets.length === 0) return null;

    urgentTickets.sort((a, b) => {
        const riskPriority = { 'CRITICAL': 2, 'WARNING': 1 };
        if (riskPriority[a.risk_level] !== riskPriority[b.risk_level]) {
            return riskPriority[b.risk_level] - riskPriority[a.risk_level];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return urgentTickets[0];
};

const MaintenanceRecommendation = () => {
    const { data, loading, error } = useMachineData();
    const tickets = data?.tickets || [];

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="bg-dark-800 p-6 rounded-xl flex items-center justify-center border border-dark-700 min-h-[300px]">
                <Loader2 className="animate-spin text-accent-cyan mr-2" />
                <span className="text-gray-400">Menganalisis Data...</span>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div className="bg-red-900/10 text-red-400 p-6 rounded-xl border border-red-700 flex flex-col items-center justify-center min-h-[200px] text-center">
                <AlertTriangle size={32} className="mb-2" />
                <p>Gagal memuat rekomendasi.</p>
            </div>
        );
    }

    const topRec = findTopRecommendation(tickets);

    // --- SAFE STATE (TIDAK ADA ISU) ---
    if (!topRec) {
        return (
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="p-4 bg-green-900/20 rounded-full mb-4 animate-pulse">
                    <CheckCircle className="text-accent-success" size={48} />
                </div>
                <h3 className="text-xl font-bold text-white">Sistem Optimal</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-[250px]">
                    Semua sensor dalam ambang batas normal. Tidak ada tindakan diperlukan.
                </p>
            </div>
        );
    }

    // Persiapan Data
    const recommendationText = topRec.recommendation || "Terdeteksi anomali pada sensor. Lakukan pengecekan manual segera.";
    const affectedComponent = mapComponentToFailure(topRec.failure_type);
    
    // Format tanggal agar lebih pendek dan rapi (menghindari wrapping berlebih)
    const formattedDate = new Date(topRec.timestamp).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });

    // --- WARNING/CRITICAL STATE ---
    return (
        // HAPUS 'h-full' dan GANTI dengan 'h-auto' agar tinggi menyesuaikan konten
        <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-xl h-auto flex flex-col w-full">
            
            {/* 1. Header Section */}
            <div className="p-5 flex flex-col items-center text-center shrink-0 border-b border-dark-700/50">
                <div className={`p-3 rounded-full mb-2 transition-transform hover:scale-110 ${
                    topRec.risk_level === 'CRITICAL' ? 'bg-red-900/30 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-yellow-900/30 shadow-[0_0_15px_rgba(202,138,4,0.3)]'
                }`}>
                    <Wrench className={`${topRec.risk_level === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`} size={28} />
                </div>
                <h2 className="text-xl font-bold text-white">Tindakan Diperlukan</h2>
                
                {/* Badge dipindah ke sini agar lebih rapi */}
                <span className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    topRec.risk_level === 'CRITICAL' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-yellow-500 text-black'
                }`}>
                    {topRec.risk_level}
                </span>
            </div>

            {/* 2. Content Box */}
            <div className="flex-1 bg-dark-900/30 p-4 md:p-5 flex flex-col gap-4">
                
                {/* Info Utama: ID Mesin & Failure */}
                <div className="flex items-center justify-between bg-dark-800 p-3 rounded-lg border border-dark-600">
                    <div className="flex items-center gap-2">
                        <Activity className="text-gray-500" size={16} />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Mesin ID</p>
                            <p className="text-white font-bold text-sm">{topRec.machine_id}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Failure Type</p>
                        <p className="text-white font-bold text-sm">{topRec.failure_type}</p>
                    </div>
                </div>

                {/* Grid Details (Waktu & Komponen) */}
                <div className="grid grid-cols-2 gap-3">
                    <RecDetail 
                        icon={<Clock size={14} className="text-gray-400"/>}
                        title="Waktu Deteksi" 
                        value={formattedDate} 
                    />
                    <RecDetail 
                        icon={<Zap size={14} className="text-gray-400"/>}
                        title="Komponen" 
                        value={affectedComponent} 
                        highlight 
                    />
                </div>

                {/* AI Recommendation Box */}
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-600">
                    <p className="text-xs text-accent-cyan uppercase font-bold mb-2 flex items-center gap-2">
                        <Wrench size={14} /> Langkah Perbaikan
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed break-words">
                        {recommendationText}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Sub-komponen Detail (Diperbaiki agar text wrapping aman)
const RecDetail = ({ icon, title, value, highlight = false }) => (
    <div className="p-3 bg-dark-800 rounded-lg border border-dark-700/50 flex flex-col justify-center h-full">
        <div className="flex items-center gap-1.5 mb-1">
            {icon}
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">{title}</p>
        </div>
        {/* 'break-words' memastikan teks panjang turun ke bawah, tidak nabrak layout */}
        <p className={`text-sm font-semibold break-words leading-tight ${highlight ? 'text-accent-cyan' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

export default MaintenanceRecommendation;