// File: src/components/TimeSeriesChart.jsx

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Fungsi untuk generate data dummy mundur ke belakang (Simulasi History)
const generateMockHistory = (currentData) => {
  if (!currentData) return [];

  const history = [];
  const now = new Date();
  
  // Base values dari data sensor saat ini
  const baseTemp = currentData.air_temp_k ? (currentData.air_temp_k - 273.15) : 30; // Celsius
  const baseTorque = currentData.torque_nm || 40;

  for (let i = 15; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000); // Mundur per 5 menit
    
    // Random fluctuation (biar grafik naik turun natural)
    const randomTemp = (Math.random() - 0.5) * 5; 
    const randomTorque = (Math.random() - 0.5) * 10;

    history.push({
      time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      temp: parseFloat((baseTemp + randomTemp).toFixed(1)),
      torque: parseFloat((baseTorque + randomTorque).toFixed(1)),
    });
  }
  return history;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-900 border border-dark-600 p-3 rounded-lg shadow-xl text-xs">
        <p className="text-gray-400 mb-1 font-mono">{label}</p>
        <p className="text-cyan-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Temp: {payload[0].value}°C
        </p>
        <p className="text-purple-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          Torque: {payload[1].value} Nm
        </p>
      </div>
    );
  }
  return null;
};

const TimeSeriesChart = ({ machineData }) => {
  // Generate data history setiap kali machineData berubah
  const data = useMemo(() => generateMockHistory(machineData), [machineData]);

  if (!machineData) {
    return <div className="h-full flex items-center justify-center text-gray-500 text-xs">No Data Selected</div>;
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {/* Gradient untuk Warna Cyan (Suhu) */}
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            {/* Gradient untuk Warna Purple (Torque) */}
            <linearGradient id="colorTorque" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            interval={4} // Tampilkan label setiap 4 titik
          />
          
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip content={<CustomTooltip />} />

          {/* Area Chart 1: Temperature */}
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#06b6d4" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTemp)" 
            animationDuration={1500}
          />

          {/* Area Chart 2: Torque */}
          <Area 
            type="monotone" 
            dataKey="torque" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTorque)" 
            animationDuration={1500}
          />
          
          {/* Garis Batas Kritis (Simulasi) */}
          <ReferenceLine y={60} stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: 'Limit', fill: 'red', fontSize: 10 }} />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;