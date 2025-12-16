// File: src/pages/Dashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import MaintenanceRecommendation from '../components/MaintenanceRecommendation';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, CheckCircle, Activity, Cpu, Loader2, X, FileText, CheckSquare, Square, Menu
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
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

// --- KOMPONEN KARTU KECIL (RESPONSIVE) ---
const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-dark-800 p-5 rounded-xl border border-dark-700 relative overflow-hidden group hover:border-dark-600 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-[10px] md:text-xs uppercase font-semibold tracking-wider">{title}</h3>
            <div className={`p-2 rounded-lg bg-dark-900 shadow-inner ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-[10px] md:text-xs text-gray-500 truncate">{subtext}</div>
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

    // --- STATE LOCAL UNTUK STATUS SOLVED ---
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

    useEffect(() => {
        if (overview.length > 0 && !selectedMachine) {
            setSelectedMachine(overview[0].machine_id);
        }
    }, [overview, selectedMachine]);

    // --- HANDLER: TOGGLE SOLVE STATUS ---
    const handleToggleSolve = (e, ticketId) => {
        e.stopPropagation();
        setSolvedTickets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(ticketId)) {
                newSet.delete(ticketId);
            } else {
                newSet.add(ticketId);
            }
            return newSet;
        });
    };

    // 3. LOGIKA CREATE TICKET
    const handleCreateTicket = async () => {
        if (!newReportTitle || !selectedMachine) {
            return toast.error("Judul Laporan dan Mesin harus dipilih!", {
                style: { background: '#333', color: '#fff' }
            });
        }

        setIsGenerating(true);

        const loadingToast = toast.loading("Sedang membuat tiket laporan...", {
            style: { background: '#1F2937', color: '#fff' }
        });

        const selectedMachineData = overview.find(m => m.machine_id === selectedMachine);

        if (!selectedMachineData) {
            setIsGenerating(false);
            return toast.error("Error: Data sensor mesin tidak ditemukan.", {
                id: loadingToast,
            });
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

            toast.success("Tiket berhasil dibuat!", {
                id: loadingToast,
                duration: 3000,
                icon: '✅',
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #06B6D4'
                },
            });

        } catch (err) {
            toast.error(`Gagal membuat laporan: ${err.message}`, {
                id: loadingToast,
                duration: 4000
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex flex-col justify-center items-center h-[80vh] text-white text-lg gap-3">
                <Loader2 className="animate-spin text-accent-cyan" size={40} />
                <p className="animate-pulse">Loading Dashboard Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 bg-red-900/20 text-red-400 border border-red-700/50 rounded-xl m-4 md:m-8">
                <h1 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle /> Error Loading Data
                </h1>
                <p>Gagal mengambil data: {error.message || error}</p>
                <button onClick={refreshData} className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-bold transition">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6 pb-20 md:pb-10 relative px-1 md:px-0">
            <Toaster position="top-center" reverseOrder={false} />

            {/* HEADER RESPONSIVE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-800/50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border border-dark-700 md:border-none">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 text-xs md:text-sm mt-1">Real-time monitoring Plant A-12</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto px-4 py-2.5 bg-accent-cyan text-black font-bold text-sm rounded-lg hover:bg-cyan-400 transition active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex justify-center items-center gap-2"
                >
                    <FileText size={16} /> New Report
                </button>
            </div>

            {/* KPI CARDS GRID RESPONSIVE */}
            {/* Mobile: 1 kolom (atau 2 jika layar agak lebar), Tablet: 2 kolom, Desktop: 4 kolom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                    subtext="Mesin nilai sensor tinggi"
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

            {/* GRID UTAMA (TABLE + SIDEBAR) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* --- TABEL ANOMALI RESPONSIVE --- */}
                <div className="xl:col-span-2 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden shadow-lg flex flex-col h-full">
                    <div className="p-4 md:p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800">
                        <h3 className="font-bold text-white text-sm md:text-base">Recent Anomalies</h3>
                        <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1 rounded">Last 7 items</span>
                    </div>
                    
                    {/* WRAPPER SCROLL UNTUK MOBILE */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left text-gray-300 min-w-[600px] md:min-w-full">
                            <thead className="bg-dark-900/50 text-gray-400 uppercase text-[10px] md:text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 md:px-6 md:py-4">ID</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Machine</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Date/Time</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Severity</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">RUL</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {recentAnomalies.length > 0 ? (
                                    recentAnomalies.map((row) => {
                                        const isSolved = solvedTickets.has(row.id) || row.status === 'Resolved';
                                        return (
                                            <tr
                                                key={row.id || Math.random()}
                                                onClick={() => navigate(`/machine/${row.machine_id}`)}
                                                className={`transition-colors cursor-pointer group ${
                                                    isSolved ? 'bg-green-900/5 hover:bg-green-900/10' : 'hover:bg-dark-700/50'
                                                }`}
                                            >
                                                <td className="px-4 py-3 md:px-6 md:py-4 font-mono text-white text-xs md:text-sm">
                                                    #{row.id}
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4 font-mono text-accent-cyan font-semibold text-xs md:text-sm">
                                                    {row.machine_id}
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4 text-xs">
                                                    <div className="flex flex-col">
                                                        <span className={isSolved ? "line-through text-gray-600" : "text-white"}>
                                                            {row.failure_type}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">{new Date(row.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4">
                                                    {!isSolved ? (
                                                        <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold inline-block ${
                                                            row.risk_level === 'CRITICAL' ? 'text-red-400 bg-red-900/20 border border-red-900/30' :
                                                            row.risk_level === 'WARNING' ? 'text-yellow-400 bg-yellow-900/20 border border-yellow-900/30' :
                                                            'text-green-400 bg-green-900/20 border border-green-900/30'
                                                        }`}>
                                                            {row.risk_level}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded text-[10px] md:text-xs font-bold text-green-400 bg-green-900/20 flex items-center gap-1 w-fit">
                                                            <CheckCircle size={12} /> SOLVED
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-mono">
                                                    {row.predicted_rul != null ? Number(row.predicted_rul).toFixed(0) + 'h' : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                                    <button
                                                        onClick={(e) => handleToggleSolve(e, row.id)}
                                                        className={`p-2 rounded-lg transition-all active:scale-90 ${
                                                            isSolved
                                                                ? 'bg-accent-success text-black hover:bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                                                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600'
                                                        }`}
                                                    >
                                                        {isSolved ? <CheckSquare size={18} /> : <Square size={18} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                            <CheckCircle size={40} className="mb-2 opacity-20" />
                                            No recent anomaly tickets found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Kolom Kanan: Rekomendasi & Info */}
                <div className="flex flex-col gap-6">
                    <MaintenanceRecommendation />
                    
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="text-gray-400" size={20} />
                            <h3 className="font-bold text-white">Time Series Snapshot</h3>
                        </div>
                        <div className="h-32 rounded-lg bg-dark-900/50 border border-dark-600 border-dashed flex flex-col items-center justify-center text-center p-4">
                            <p className="text-gray-500 text-sm">
                                Grafik historis live tidak ditampilkan (Versi Demo).
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Integrasi database TSDB diperlukan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL RESPONSIVE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-dark-800 border border-dark-600 w-full md:w-[500px] max-w-full rounded-2xl p-5 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dark-700">
                            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-accent-cyan" size={20}/> Create Manual Ticket
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 hover:text-white bg-dark-700 p-1.5 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold tracking-wider">Select Machine ID</label>
                                <div className="relative">
                                    <select
                                        value={selectedMachine}
                                        onChange={(e) => setSelectedMachine(e.target.value)}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan focus:outline-none text-sm appearance-none"
                                    >
                                        {overview.map(m => (
                                            <option key={m.machine_id} value={m.machine_id}>{m.machine_id} (Type: {m.type})</option>
                                        ))}
                                        {overview.length === 0 && <option>No Machines Available</option>}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                        <Menu size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold tracking-wider">Report Title / Issue</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Unusual Vibration noticed during shift..."
                                    value={newReportTitle}
                                    onChange={(e) => setNewReportTitle(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan focus:outline-none text-sm placeholder:text-gray-600"
                                />
                            </div>
                            <div className="bg-blue-900/20 border border-blue-900/30 p-3 rounded-lg">
                                <p className="text-xs text-blue-200 flex gap-2">
                                    <Activity size={14} className="shrink-0 mt-0.5" />
                                    Note: Creating a manual ticket logs the current live sensor data as a snapshot for AI analysis.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8 pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isGenerating}
                                className="flex-1 py-3 bg-transparent border border-dark-600 hover:bg-dark-700 text-gray-300 rounded-xl font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTicket}
                                disabled={isGenerating || !selectedMachine}
                                className={`flex-1 py-3 text-black rounded-xl font-bold transition flex items-center justify-center gap-2 ${isGenerating || !selectedMachine ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-accent-cyan hover:bg-cyan-400 shadow-lg shadow-cyan-900/20'}`}
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