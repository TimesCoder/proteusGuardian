// File: src/pages/Dashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import MaintenanceRecommendation from '../components/MaintenanceRecommendation';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, CheckCircle, Activity, Cpu, Loader2, X, FileText, CheckSquare, Square
} from 'lucide-react';

import { useMachineData } from '../hooks/useMachineData';
import { CONFIG } from '../config';

// --- API CONSTANTS ---
const CREATE_TICKET_API_URL = `${CONFIG.API_BASE_URL}/api/data/tickets`;

// --- UTILITY ---
const kelvinToCelsius = (k) => k - 273.15;

const calculateMachineStats = (overviewData, tickets) => {
    const totalMachines = overviewData.length;
    const machinesWithLiveAnomalies = overviewData.filter(m =>
        m.air_temp_k > 305 || m.torque_nm > 70 || m.tool_wear_min > 150
    ).length;
    return { totalMachines, machinesWithLiveAnomalies };
};

// --- KOMPONEN KARTU KECIL ---
const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-dark-800 p-5 rounded-xl border border-dark-700 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider">{title}</h3>
            <div className={`p-2 rounded-lg bg-dark-900 ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-gray-500">{subtext}</div>
    </div>
);

// --- KOMPONEN UTAMA DASHBOARD ---
const Dashboard = () => {
    const navigate = useNavigate();

    // 1. MENGAMBIL DATA DARI HOOK
    const { data, loading, error, refreshData } = useMachineData();

    const safeData = data || { stats: {}, overview: [], tickets: [] };
    const stats = safeData.stats || {};
    const overview = safeData.overview || [];
    const tickets = safeData.tickets || [];

    const { totalMachines, machinesWithLiveAnomalies } = calculateMachineStats(overview, tickets);

    // --- STATE LOCAL UNTUK STATUS SOLVED (SIMULASI FRONTEND) ---
    // Menyimpan ID tiket yang sudah di-solve secara lokal agar UI berubah
    const [solvedTickets, setSolvedTickets] = useState(new Set());

    // --- LOGIKA SORTING ---
    const recentAnomalies = useMemo(() => {
        return [...tickets]
            .sort((a, b) => {
                if (b.id && a.id) return b.id - a.id;
                return new Date(b.timestamp) - new Date(a.timestamp);
            })
            .slice(0, 7);
    }, [tickets]);

    // 2. STATE MODAL & FORM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newReportTitle, setNewReportTitle] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');

    // Set mesin default
    useEffect(() => {
        if (overview.length > 0 && !selectedMachine) {
            setSelectedMachine(overview[0].machine_id);
        }
    }, [overview, selectedMachine]);

    // --- HANDLER: TOGGLE SOLVE STATUS ---
    const handleToggleSolve = (e, ticketId) => {
        e.stopPropagation(); // Mencegah navigasi ke halaman detail saat tombol diklik

        setSolvedTickets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(ticketId)) {
                newSet.delete(ticketId); // Unsolve
            } else {
                newSet.add(ticketId); // Mark as Solved
                // Di sini Anda bisa menambahkan API Call untuk update status ke backend jika ada
                // console.log("Updating ticket status to SOLVED:", ticketId);
            }
            return newSet;
        });
    };

    // 3. LOGIKA CREATE TICKET
    const handleCreateTicket = async () => {
        if (!newReportTitle || !selectedMachine) {
            return alert("Judul Laporan dan Mesin harus dipilih!");
        }

        setIsGenerating(true);

        const selectedMachineData = overview.find(m => m.machine_id === selectedMachine);
        if (!selectedMachineData) {
            setIsGenerating(false);
            return alert("Error: Data sensor mesin tidak ditemukan.");
        }

        const airTempC = kelvinToCelsius(selectedMachineData.air_temp_k);

        const newTicketData = {
            machine_id: selectedMachine,
            air_temp: parseFloat(airTempC.toFixed(1)),
            rpm: selectedMachineData.rpm,
            torque: selectedMachineData.torque_nm,
            failure_type: "MANUAL_REPORT",
            confidence: 1.0,
            predicted_rul: 0,
            risk_level: "WARNING",
            ai_analysis: `Manual Report: ${newReportTitle}. Sensor: RPM ${selectedMachineData.rpm}, Temp ${airTempC.toFixed(1)}°C.`,
        };

        try {
            const response = await fetch(CREATE_TICKET_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicketData),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ detail: 'Unknown API Error' }));
                throw new Error(errorBody.detail || `HTTP Error ${response.status}`);
            }

            setIsModalOpen(false);
            setNewReportTitle('');
            await refreshData();
            alert(`✅ Tiket berhasil dibuat!`);

        } catch (err) {
            alert(`❌ Gagal membuat laporan: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center h-full text-white text-lg">
                <Loader2 className="animate-spin mr-2" /> Loading Dashboard Data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-900/20 text-red-400 border border-red-700 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Error Loading Data</h1>
                <p>Gagal mengambil data: {error.message || error}</p>
                <button onClick={refreshData} className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-bold">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10 relative">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 text-sm">Real-time monitoring Plant A-12</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-accent-cyan text-black font-bold text-sm rounded-lg hover:bg-cyan-400 transition active:scale-95 shadow-neon-cyan"
                >
                    + New Report
                </button>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Machines"
                    value={totalMachines}
                    subtext="Unit yang dipantau"
                    icon={Cpu}
                    color="text-accent-purple"
                />
                <StatCard
                    title="Critical Risk"
                    value={stats.high_risk_count || 0}
                    subtext="Tiket aktif, cek segera"
                    icon={AlertTriangle}
                    color="text-accent-danger"
                />
                <StatCard
                    title="Anomalies Live"
                    value={machinesWithLiveAnomalies}
                    subtext="Mesin menunjukkan nilai sensor tinggi"
                    icon={Activity}
                    color="text-accent-warning"
                />
                <StatCard
                    title="Avg RUL (Hours)"
                    value={stats.avg_rul_all_tickets ? stats.avg_rul_all_tickets.toFixed(0) : 'N/A'}
                    subtext="Rata-rata sisa umur mesin"
                    icon={CheckCircle}
                    color="text-accent-success"
                />
            </div>

            {/* GRID UTAMA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- TABEL ANOMALI DENGAN KOLOM ACTION --- */}
                <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <div className="p-6 border-b border-dark-700">
                        <h3 className="font-bold text-white">Recent Anomalies (Tickets)</h3>
                    </div>
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="bg-dark-900/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Machine</th>
                                <th className="px-6 py-4">Date/Time</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">RUL</th>
                                {/* KOLOM BARU: ACTION */}
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {recentAnomalies.length > 0 ? (
                                recentAnomalies.map((row) => {
                                    // Cek apakah tiket ini sudah ditandai solved
                                    const isSolved = solvedTickets.has(row.id) || row.status === 'Resolved';
                                    
                                    return (
                                        <tr
                                            key={row.id || Math.random()}
                                            onClick={() => navigate(`/machine/${row.machine_id}`)}
                                            className={`transition-colors cursor-pointer ${
                                                isSolved ? 'bg-green-900/10 hover:bg-green-900/20' : 'hover:bg-dark-700/50'
                                            }`}
                                        >
                                            <td className="px-6 py-4 font-mono text-white">{row.id}</td>
                                            <td className="px-6 py-4 font-mono text-accent-cyan">{row.machine_id}</td>
                                            <td className="px-6 py-4">
                                                {/* Coret issue jika solved */}
                                                {new Date().toLocaleString()}
                                                <span className={isSolved ? "line-through text-gray-500" : ""}>
                                                    {row.failure_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {!isSolved ? (
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        row.risk_level === 'CRITICAL' ? 'text-red-400 bg-red-900/20' :
                                                        row.risk_level === 'WARNING' ? 'text-yellow-400 bg-yellow-900/20' :
                                                        'text-green-400 bg-green-900/20'
                                                    }`}>
                                                        {row.risk_level}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-xs font-bold text-green-400 bg-green-900/20">
                                                        SOLVED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.predicted_rul != null ? Number(row.predicted_rul).toFixed(0) + 'h' : 'N/A'}
                                            </td>
                                            
                                            {/* TOMBOL ACTION (SOLVE/UNSOLVE) */}
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={(e) => handleToggleSolve(e, row.id)}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        isSolved 
                                                            ? 'bg-accent-success text-black hover:bg-green-400' 
                                                            : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600'
                                                    }`}
                                                    title={isSolved ? "Mark Unsolved" : "Mark as Solved"}
                                                >
                                                    {isSolved ? <CheckSquare size={18} /> : <Square size={18} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No recent anomaly tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Kolom Kanan (1/3): Rekomendasi Kritis */}
                <div>
                    <MaintenanceRecommendation />
                    <div className="mt-6 bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="font-bold text-white">Time Series Data</h3>
                        <p className="text-gray-500 mt-2">
                            Grafik historis tidak ditampilkan karena data time-series mentah tidak diekspos oleh API.
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL CREATE TICKET */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-800 border border-dark-600 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Create Manual Ticket</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Select Machine ID</label>
                                <select
                                    value={selectedMachine}
                                    onChange={(e) => setSelectedMachine(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-accent-cyan focus:outline-none text-sm"
                                >
                                    {overview.map(m => (
                                        <option key={m.machine_id} value={m.machine_id}>{m.machine_id} (Type: {m.type})</option>
                                    ))}
                                    {overview.length === 0 && <option>No Machines Available</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase">Ticket/Report Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Unusual Vibration noticed..."
                                    value={newReportTitle}
                                    onChange={(e) => setNewReportTitle(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-accent-cyan focus:outline-none text-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-500 pt-2">Note: Creating a manual ticket logs the current live sensor data.</p>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isGenerating}
                                className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTicket}
                                disabled={isGenerating || !selectedMachine}
                                className={`flex-1 py-3 text-black rounded-xl font-bold transition flex items-center justify-center gap-2 ${isGenerating || !selectedMachine ? 'bg-gray-600 cursor-not-allowed' : 'bg-accent-cyan hover:bg-cyan-400'}`}
                            >
                                {isGenerating ? (
                                    <> <Loader2 size={18} className="animate-spin" /> Saving... </>
                                ) : (
                                    <> <FileText size={18} /> Create Ticket </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;