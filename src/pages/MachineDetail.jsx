// File: MachineDetail.jsx (FINAL - IMAGE FIX)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Thermometer, Zap, FileText, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'; // Hapus Cpu, tambah Alert/Check
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMachineData } from '../hooks/useMachineData';
import toast, { Toaster } from 'react-hot-toast';

// --- IMPORT KOMPONEN BARU ---
import FeedbackForm from '../components/FeedbackForm';
import { CONFIG } from '../config';

// --- URL untuk fetch detail aset tunggal ---
const SINGLE_ASSET_API_URL = `${CONFIG.API_BASE_URL}/api/admin/assets`;

// --- DATA DUMMY GRAFIK ---
const dummyHistoricalData = [
    { time: 'Day 1', val: 10 }, { time: 'Day 2', val: 15 },
    { time: 'Day 3', val: 30 }, { time: 'Day 4', val: 55 },
    { time: 'Day 5', val: 40 }, { time: 'Day 6', val: 65 },
    { time: 'Day 7', val: 70 },
];

// --- DUMMY IMAGES UNTUK 5 MESIN ---
const MACHINE_IMAGES = {
    "M-001": "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Tangan.jpg",
    "M-002": "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Horizontal.jpg",
    "A-101": "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Vertikal.jpg",
    "B-202": "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Universal.jpg",
    "C-303": "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Omniversal.jpg"
};

// Fallback image
const DEFAULT_MACHINE_IMAGE = "https://i0.wp.com/pengelasan.net/wp-content/uploads/2020/01/Jenis-Mesin-Frais-Tangan.jpg";


// --- UTILITY ---
const kelvinToCelsius = (k) => k - 273.15;

const getRiskStatus = (machineId, tickets) => {
    if (!Array.isArray(tickets)) return { health: 'Unknown', color: 'bg-gray-500', issue: 'No Data', rul: 'N/A' };

    const machineTickets = tickets
        .filter(t => t.machine_id === machineId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (machineTickets.length > 0) {
        const latest = machineTickets[0];
        if (latest.risk_level === 'CRITICAL') {
            return {
                health: 'Critical',
                color: 'bg-accent-danger',
                issue: latest.failure_type,
                rul: latest.predicted_rul ? `${latest.predicted_rul.toFixed(0)}h` : 'N/A'
            };
        } else if (latest.risk_level === 'WARNING') {
            return {
                health: 'Warning',
                color: 'bg-accent-warning',
                issue: latest.failure_type,
                rul: latest.predicted_rul ? `${latest.predicted_rul.toFixed(0)}h` : 'N/A'
            };
        }
    }
    return { health: 'Operational', color: 'bg-accent-success', issue: 'Normal', rul: '> 2 weeks' };
};

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} at ${url}`);
    }
    return response.json();
};


const MachineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Ambil data global
    const { data: globalData, loading: globalLoading, error: globalError, getMachineLiveSensor, refreshData } = useMachineData();

    const tickets = globalData?.tickets || [];

    // 2. State lokal
    const [liveSensorData, setLiveSensorData] = useState(null);
    const [machineAsset, setMachineAsset] = useState(null);
    const [detailLoading, setDetailLoading] = useState(true);
    const [detailError, setDetailError] = useState(null);

    // Fungsi fetch detail aset
    const fetchMachineAssetDetail = useCallback(async (machineId) => {
        try {
            const asset = await fetcher(`${SINGLE_ASSET_API_URL}/${machineId}`);
            setMachineAsset(asset);
        } catch (err) {
            console.error("Failed to fetch asset detail:", err);
            setDetailError("Gagal memuat detail aset statis.");
        }
    }, []);

    // --- LOGIC EXPORT ---
    const handleExportReport = () => {
        const reportData = {
            machine_id: id,
            asset_info: machineAsset,
            current_readings: liveSensorData,
            risk_status: getRiskStatus(id, tickets),
            recent_tickets: tickets.filter(t => t.machine_id === id).slice(0, 3)
        };

        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Diagnostic_Report_${id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Laporan Diagnostik untuk ${id} berhasil diunduh!`);
    };

    // 3. Effect Fetch Data
    useEffect(() => {
        if (!id) return;
        const fetchAllDetails = async () => {
            if (!machineAsset) setDetailLoading(true);
            setDetailError(null);
            try {
                if (!machineAsset) {
                    await fetchMachineAssetDetail(id);
                }
                const sensorData = await getMachineLiveSensor(id);
                setLiveSensorData(sensorData);
            } catch (err) {
                setDetailError("Gagal memuat data live atau aset.");
            } finally {
                setDetailLoading(false);
            }
        };
        fetchAllDetails();
        const intervalId = setInterval(fetchAllDetails, 5000);
        return () => clearInterval(intervalId);
    }, [id, machineAsset, fetchMachineAssetDetail, getMachineLiveSensor]);

    // UI Loading
    if (globalLoading || (detailLoading && !machineAsset)) {
        return (
            <div className="flex justify-center items-center h-full text-white text-lg">
                <Loader2 className="animate-spin mr-2" /> Loading Machine {id} Details...
            </div>
        );
    }

    // UI Error
    if (globalError || detailError || !machineAsset) {
        return (
            <div className="p-8 bg-red-900/20 text-red-400 border border-red-700 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Error / Data Not Found</h1>
                <p>Mesin ID: {id} tidak ditemukan. ({globalError || detailError})</p>
                <button onClick={() => navigate('/fleet')} className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-bold">Back to Fleet</button>
            </div>
        );
    }

    // --- Prepare Data ---
    const sensor = liveSensorData || {};
    const riskStatus = getRiskStatus(id, tickets);
    const airTempC = kelvinToCelsius(sensor.air_temp_k || 0).toFixed(1);
    const processTempC = kelvinToCelsius(sensor.process_temp_k || 0).toFixed(1);
    const tempDiff = (processTempC - airTempC).toFixed(1);

    const borderColor = riskStatus.health === 'Critical' ? 'border-red-600' :
        riskStatus.health === 'Warning' ? 'border-yellow-600' : 'border-dark-700';

    const machineImage = MACHINE_IMAGES[id] || DEFAULT_MACHINE_IMAGE;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-dark-800 rounded-lg transition text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{machineAsset.machine_id} - Type {machineAsset.asset_type}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 ${riskStatus.color} rounded-full`}></span>
                            <span className="text-sm text-gray-400">{riskStatus.health} - {riskStatus.issue}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleExportReport}
                    className="px-3 py-2 sm:px-4 bg-accent-cyan text-black font-bold text-sm rounded-lg hover:bg-cyan-400 transition shadow-neon-cyan"
                >
                    <div className="flex items-center gap-2">
                        <FileText size={18} />
                        <span className="hidden sm:block">Export Diagnostic Report</span>
                    </div>
                </button>
            </div>

            {/* KONTEN UTAMA */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                {/* AREA GAMBAR MESIN (TENGAH) - DIPERBAIKI */}
                <div className={`lg:col-span-2 bg-dark-800 rounded-xl border ${borderColor} relative overflow-hidden group flex flex-col justify-end`}>

                    {/* 1. GAMBAR MESIN (FULL COVER) */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={machineImage}
                            alt={`Machine ${id}`}
                            // Ubah opacity agar gambar terlihat jelas (tidak tertutup icon)
                            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Gradient Overlay agar teks putih di bawahnya terbaca */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
                    </div>

                    {/* 2. GRID BLUEPRINT EFFECT (Opsional, dibuat halus) */}
                    <div className="absolute inset-0 opacity-10 z-10 pointer-events-none" style={{
                        backgroundImage: 'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>

                    {/* 3. STATUS BADGE & TELEMETRY (DI ATAS GAMBAR) */}
                    <div className="relative z-20 w-full p-6 sm:p-10 flex flex-col gap-4">

                        {/* Status Badge (Pengganti Icon CPU Besar) */}
                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border ${riskStatus.health === 'Critical' ? 'bg-red-900/80 border-red-500 text-white' :
                                    riskStatus.health === 'Warning' ? 'bg-yellow-900/80 border-yellow-500 text-white' :
                                        'bg-green-900/80 border-green-500 text-white'
                                }`}>
                                {riskStatus.health === 'Critical' ? <AlertTriangle size={20} className="animate-pulse" /> :
                                    riskStatus.health === 'Warning' ? <AlertTriangle size={20} /> :
                                        <CheckCircle size={20} />}
                                <span className="font-bold uppercase tracking-wide text-sm">{riskStatus.health} State</span>
                            </div>
                        </div>

                        {/* Info Overlay (Data Sensor) */}
                        <div className="bg-dark-900/80 p-5 rounded-xl border border-dark-600 backdrop-blur-md shadow-2xl">
                            <h3 className="text-xs text-accent-cyan uppercase mb-3 font-bold tracking-wider flex items-center gap-2">
                                <Activity size={14} /> Real-time Telemetry
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase">RPM</span>
                                    <span className="text-white font-mono font-bold text-lg">{sensor.rpm || '0'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase">Torque</span>
                                    <span className="text-white font-mono font-bold text-lg">{sensor.torque_nm || '0'} <span className="text-xs text-gray-500">Nm</span></span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase">Wear</span>
                                    <span className="text-white font-mono font-bold text-lg">{sensor.tool_wear_min || '0'} <span className="text-xs text-gray-500">min</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PANEL KANAN */}
                <div className="flex flex-col gap-4">
                    {/* Sensor Cards */}
                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-accent-cyan" /> Sensor Readings
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-dark-900 rounded border border-dark-700">
                                <div className="flex items-center gap-3">
                                    <Thermometer size={16} className="text-orange-400" />
                                    <span className="text-sm text-gray-300">Air / Process Temp</span>
                                </div>
                                <span className="font-mono text-white">{airTempC}°C / {processTempC}°C</span>
                            </div>
                            <div className={`flex justify-between items-center p-3 bg-dark-900 rounded border ${tempDiff > 10 ? 'border-accent-danger/30' : 'border-dark-700'}`}>
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className={`${tempDiff > 10 ? 'text-accent-danger' : 'text-accent-success'}`} />
                                    <span className="text-sm text-gray-300">Temp Diff</span>
                                </div>
                                <span className={`font-mono ${tempDiff > 10 ? 'text-accent-danger' : 'text-white'}`}>{tempDiff}°C</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-dark-900 rounded border border-dark-700">
                                <div className="flex items-center gap-3">
                                    <Zap size={16} className="text-yellow-400" />
                                    <span className="text-sm text-gray-300">Tool Wear</span>
                                </div>
                                <span className="font-mono text-white">{sensor.tool_wear_min || 'N/A'} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Form */}
                    {liveSensorData && (
                        <FeedbackForm
                            machineId={id}
                            liveSensorData={liveSensorData}
                            onFeedbackSubmitted={refreshData}
                        />
                    )}

                    {/* Chart */}
                    <div className="flex-1 bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col">
                        <h3 className="text-sm font-bold text-white mb-2">RUL Prediction (Next 7 Days)</h3>
                        <div className="flex-1 w-full min-h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dummyHistoricalData}>
                                    <Line type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#151A23', border: 'none' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">Predicted RUL: {riskStatus.rul}</p>
                    </div>

                    {/* Recent Tickets */}
                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" /> Recent Tickets
                        </h3>
                        {tickets.filter(t => t.machine_id === id).slice(0, 3).map((ticket, index) => (
                            <div key={index} className="p-2 border-b border-dark-700 last:border-b-0">
                                <p className={`font-medium ${ticket.risk_level === 'CRITICAL' ? 'text-accent-danger' : 'text-accent-warning'}`}>
                                    {ticket.failure_type}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {ticket.ai_analysis ? ticket.ai_analysis.substring(0, 50) : "No analysis"}...
                                </p>
                            </div>
                        ))}
                        {tickets.filter(t => t.machine_id === id).length === 0 && (
                            <p className="text-sm text-gray-500 p-2">No maintenance history found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MachineDetail;