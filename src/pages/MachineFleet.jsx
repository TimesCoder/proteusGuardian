// File: src/pages/MachineFleet.jsx

import React, { useState, useEffect } from 'react'; // Tambah useEffect & useState
import { useNavigate } from 'react-router-dom';
import { useMachineData } from '../hooks/useMachineData'; 
import { Cpu, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// --- UTILITY FUNCTION (DIPERBARUI) ---
const getMachineStatus = (machineId, tickets, solvedTicketsSet) => {
    // Cari tiket untuk mesin ini
    const machineTickets = tickets
        .filter(t => t.machine_id === machineId)
        // FILTER PENTING: Abaikan tiket yang sudah di-solve (ada di solvedTicketsSet)
        .filter(t => !solvedTicketsSet.has(t.id)) 
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (machineTickets.length > 0) {
        const latestTicket = machineTickets[0];
        const risk = latestTicket.risk_level;
        
        if (risk === 'CRITICAL') {
            return {
                status: 'CRITICAL',
                color: 'text-red-400 bg-red-900/20',
                issue: 'Critical Issue',
                icon: AlertTriangle
            };
        } else if (risk === 'WARNING') {
            return {
                status: 'WARNING',
                color: 'text-yellow-400 bg-yellow-900/20',
                issue: 'Warning',
                icon: AlertTriangle
            };
        }
    }
    
    // Default status (SAFE) jika tidak ada tiket aktif/critical
    return {
        status: 'SAFE',
        color: 'text-green-400 bg-green-900/20',
        issue: 'System Normal',
        icon: CheckCircle
    };
};

const MachineFleet = () => {
    const navigate = useNavigate();
    
    // 1. Ambil data Backend
    const { data, loading, error, refreshData } = useMachineData();
    const safeData = data || { overview: [], tickets: [] };
    const machineOverview = safeData.overview || []; 
    const tickets = safeData.tickets || [];

    // 2. Ambil data Solved Tickets dari LocalStorage agar sinkron dengan Dashboard
    const [solvedTicketsSet, setSolvedTicketsSet] = useState(new Set());

    useEffect(() => {
        // Baca localStorage setiap kali halaman dimuat
        const saved = localStorage.getItem('solvedTickets');
        if (saved) {
            setSolvedTicketsSet(new Set(JSON.parse(saved)));
        }
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-white text-lg">
                <Loader2 className="animate-spin mr-2" /> Loading Machine Fleet Data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-900/20 text-red-400 border border-red-700 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Error Loading Data</h1>
                <p>Gagal mengambil data armada mesin: {error}</p>
                <button onClick={refreshData} className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-bold">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Machine Fleet Overview</h1>
                    <p className="text-gray-400 text-sm">{machineOverview.length} machines monitored.</p>
                </div>
                <button 
                    onClick={refreshData}
                    className="px-4 py-2 bg-dark-700 text-white font-bold text-sm rounded-lg hover:bg-dark-600 transition active:scale-95"
                >
                    Refresh Data
                </button>
            </div>

            {/* MACHINE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {machineOverview.map((machine) => {
                    // PENTING: Pass solvedTicketsSet ke fungsi helper
                    const status = getMachineStatus(machine.machine_id, tickets, solvedTicketsSet);
                    const StatusIcon = status.icon;

                    return (
                        <div 
                            key={machine.machine_id} 
                            className={`bg-dark-800 p-6 rounded-xl border ${
                                status.status === 'CRITICAL' ? 'border-red-600' : 
                                status.status === 'WARNING' ? 'border-yellow-600' : 'border-dark-700'
                            } hover:border-accent-cyan/50 transition-all cursor-pointer group`}
                            onClick={() => navigate(`/machine/${machine.machine_id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Cpu size={28} className="text-gray-400 group-hover:text-accent-cyan transition-colors" />
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${status.color}`}>
                                    {status.status}
                                </span>
                            </div>
                            
                            <h2 className="text-xl font-bold text-white mb-1">{machine.machine_id}</h2>
                            <p className="text-gray-500 text-sm mb-4">Type: {machine.asset_type || machine.type || 'N/A'}</p> 
                            
                            <div className="space-y-2 text-sm">
                                <p className="flex justify-between text-gray-400">
                                    <span>Location:</span>
                                    <span className="font-mono text-white truncate">{machine.location || 'N/A'}</span>
                                </p>
                                <p className="flex justify-between text-gray-400">
                                    <span>Manufacturer:</span>
                                    <span className="font-mono text-white">{machine.manufacturer || 'N/A'}</span>
                                </p>
                            </div>

                            <div className={`mt-4 pt-4 border-t ${
                                status.status === 'CRITICAL' ? 'border-red-900/50' : 'border-dark-700'
                            }`}>
                                <div className={`flex items-center gap-2 text-sm font-medium ${
                                    status.status === 'SAFE' ? 'text-green-400' : status.color.split(' ')[0]
                                }`}>
                                    <StatusIcon size={16} />
                                    {status.issue}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {machineOverview.length === 0 && (
                     <div className="col-span-full p-8 bg-dark-700/50 rounded-xl text-center text-gray-400">
                        No machines found in the system. Check simulator status.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MachineFleet;