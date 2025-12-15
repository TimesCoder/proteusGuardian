// File: useMachineData.js (PERBAIKAN KONEKSI MONOLITH)

import { useState, useEffect, useCallback } from 'react';

import { CONFIG } from '../config';

// Tentukan BASE URL untuk Monolith ML/Data API
const MONOLITH_API_URL = CONFIG.ENDPOINTS.DATA;

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} at ${url}`);
    }
    return response.json();
};

export const useMachineData = () => {
    const [data, setData] = useState({
        overview: [],
        stats: null,
        tickets: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Overview (Machine Fleet)
            const overviewPromise = fetcher(`${MONOLITH_API_URL}/machines/overview`);

            // 2. Fetch Stats (Dashboard)
            const statsPromise = fetcher(`${MONOLITH_API_URL}/dashboard/stats`);

            // 3. Fetch Tickets (Reports)
            const ticketsPromise = fetcher(`${MONOLITH_API_URL}/tickets`);

            const [overview, stats, tickets] = await Promise.all([
                overviewPromise,
                statsPromise,
                ticketsPromise
            ]);

            setData({ overview, stats, tickets });

        } catch (err) {
            setError(err.message);
            console.error("Error fetching machine data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Fungsi untuk detail sensor spesifik
    const getMachineLiveSensor = useCallback(async (machineId) => {
        try {
            const url = `${MONOLITH_API_URL}/machines/${machineId}/live_sensor`;
            return await fetcher(url);
        } catch (error) {
            console.error(`Error fetching sensor data for ${machineId}:`, error);
            throw error;
        }
    }, []);

    return {
        data,
        loading,
        error,
        refreshData,
        getMachineLiveSensor
    };
};