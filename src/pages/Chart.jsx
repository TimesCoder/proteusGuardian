import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { Activity, BarChart2, PieChart as PieIcon, Zap, Filter, Calendar, Download, ChevronDown, Check, Loader2, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

// --- IMPORT HOOK ---
import { useMachineData } from '../hooks/useMachineData';

// --- COMPONENTS ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-900 border border-dark-700 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-gray-300 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-mono font-bold">
                {typeof entry.value === 'number' 
                    ? (Number.isInteger(entry.value) ? entry.value : entry.value.toFixed(1)) 
                    : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartCard = ({ title, icon: Icon, children, id }) => (
  <div id={id} className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-lg flex flex-col h-[350px]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
        <Icon className="text-accent-cyan" size={18} /> {title}
      </h3>
    </div>
    <div className="flex-1 w-full min-h-0 bg-dark-800"> 
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

// --- MAIN PAGE ---
const Charts = () => {
  // 1. AMBIL DATA DARI HOOK
  const { data, loading, error, refreshData } = useMachineData();
  const rawTickets = data?.tickets || [];

  // State UI
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 2. AUTO REFRESH (Agar Sinkron dengan Generator Python 15s)
  useEffect(() => {
    const interval = setInterval(() => {
        refreshData();
        // Opsional: toast.success("Data updated", { duration: 1000, icon: '🔄' });
    }, 15000); // 15 Detik
    return () => clearInterval(interval);
  }, [refreshData]);

  // 3. TRANSFORMASI DATA (Raw Tickets -> Chart Format)
  const chartData = useMemo(() => {
    if (rawTickets.length === 0) return { area: [], pie: [], bar: [], composed: [] };

    // A. AREA CHART: Trend RUL over Time (Ambil 10 tiket terakhir)
    // Kita urutkan berdasarkan ID atau Timestamp
    const sortedTickets = [...rawTickets].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const recentTickets = sortedTickets.slice(-10); // Ambil 10 terakhir

    const areaData = recentTickets.map(t => ({
        time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rul: t.predicted_rul,
        // Simulasi Health Score: Jika RUL rendah, Health rendah
        health: Math.min(100, Math.max(20, (t.predicted_rul / 150) * 100)) 
    }));

    // B. PIE CHART: Risk Distribution
    const riskCounts = { CRITICAL: 0, WARNING: 0, NORMAL: 0 };
    rawTickets.forEach(t => {
        const risk = t.risk_level?.toUpperCase() || 'NORMAL';
        if (riskCounts[risk] !== undefined) riskCounts[risk]++;
    });
    
    const pieData = [
        { name: 'Normal', value: riskCounts.NORMAL || 0, color: '#10B981' }, // Green (Default 0 karena generator cuma Critical/Warning)
        { name: 'Warning', value: riskCounts.WARNING, color: '#F59E0B' }, // Yellow
        { name: 'Critical', value: riskCounts.CRITICAL, color: '#EF4444' }, // Red
    ].filter(item => item.value > 0); // Hapus yang 0 agar grafik rapi

    // C. BAR CHART: Failure Type Frequency
    const failureCounts = {};
    rawTickets.forEach(t => {
        const type = t.failure_type || "Unknown";
        failureCounts[type] = (failureCounts[type] || 0) + 1;
    });

    const barData = Object.keys(failureCounts).map(type => ({
        type: type,
        count: failureCounts[type]
    })).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 Failures

    // D. COMPOSED CHART: Correlation (Simulasi Sensor berdasarkan Risk Ticket)
    // Karena tiket tidak punya raw sensor, kita buat korelasi logis visual
    const composedData = recentTickets.map(t => ({
        id: t.machine_id,
        // Jika Critical, Vibration tinggi (0.8 - 1.0), jika Warning (0.4 - 0.7)
        vibration: t.risk_level === 'CRITICAL' ? (0.8 + Math.random() * 0.2) : (0.4 + Math.random() * 0.3),
        // Pressure juga mengikuti
        pressure: t.risk_level === 'CRITICAL' ? (120 + Math.random() * 30) : (90 + Math.random() * 20),
    }));

    return { area: areaData, pie: pieData, bar: barData, composed: composedData };

  }, [rawTickets]);


  // --- LOGIC PDF GENERATOR (Sama seperti sebelumnya) ---
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Generating Live Report...");
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Header
      doc.setFillColor(6, 182, 212); 
      doc.rect(0, 0, pageWidth, 25, 'F'); 
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold"); doc.setFontSize(22);
      doc.text("EXECUTIVE ANALYTICS REPORT", 15, 17);
      
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text("Proteus Guardian AI", pageWidth - 15, 12, { align: "right" });
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 18, { align: "right" });

      // Body Text
      let yPos = 40;
      doc.setTextColor(0, 0, 0); 
      doc.setFontSize(12); doc.setFont("helvetica", "bold");
      doc.text("Report Summary:", 15, yPos);
      yPos += 7;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text(`Total Tickets Analyzed: ${rawTickets.length}`, 15, yPos);
      doc.text(`Active Critical Issues: ${rawTickets.filter(t => t.risk_level === 'CRITICAL').length}`, 15, yPos + 5);
      
      yPos += 15;

      // Capture Charts
      const chartElement = document.getElementById('charts-grid');
      const canvas = await html2canvas(chartElement, {
        scale: 2, backgroundColor: '#1f2937', ignoreElements: (el) => el.tagName === 'BUTTON',
      });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = pageWidth - 30;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (yPos + pdfHeight > pageHeight - 20) { doc.addPage(); yPos = 20; }
      doc.addImage(imgData, 'PNG', 15, yPos, pdfWidth, pdfHeight);
      
      doc.save(`Proteus_Live_Report_${Date.now()}.pdf`);
      toast.success("Laporan Berhasil!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Gagal generate PDF", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // --- RENDER ---
  if (loading && rawTickets.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 gap-2">
            <Loader2 className="animate-spin text-accent-cyan" size={40} />
            <p>Connecting to Neural Network...</p>
        </div>
    );
  }

  if (error) {
      return <div className="p-10 text-red-500 border border-red-800 bg-red-900/10 rounded-xl">Error Fetching Data: {error}</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-800/50 p-4 rounded-xl border border-dark-700">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Analytics Dashboard 
            <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded border border-accent-cyan/20 animate-pulse">LIVE</span>
          </h1>
          <p className="text-gray-400 text-sm">Real-time data visualization from Python Generator.</p>
        </div>
        
        {/* CONTROLS AREA */}
        <div className="flex flex-wrap gap-3 relative">
            <button 
                onClick={refreshData}
                className="p-2.5 bg-dark-800 border border-dark-600 rounded-lg hover:bg-dark-700 hover:text-accent-cyan transition text-gray-400"
                title="Force Refresh"
            >
                <RefreshCw size={18} />
            </button>

            {/* FILTER DROPDOWN */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 text-gray-200 border border-dark-600 rounded-lg text-sm hover:bg-dark-700 transition min-w-[160px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400"/> {timeRange}
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}/>
                </button>
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 overflow-hidden">
                        {['Last 7 Days', 'Last 30 Days', 'This Month'].map((range) => (
                            <button key={range} onClick={() => { setTimeRange(range); setIsFilterOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 border-b border-dark-700/50 last:border-0">{range}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* DOWNLOAD PDF */}
            <button 
                onClick={handleDownloadReport}
                disabled={isDownloading || rawTickets.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan text-black font-bold rounded-lg text-sm hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                Download Report
            </button>
        </div>
      </div>

      {/* GRID CHART */}
      <div id="charts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">

        {/* 1. AREA CHART: Trend RUL Real-time */}
        <ChartCard id="chart-area" title="Live RUL Prediction Trend" icon={Activity}>
             {/* Jika data kosong, tampilkan placeholder */}
             {chartData.area.length > 0 ? (
              <AreaChart data={chartData.area}>
                <defs>
                  <linearGradient id="colorRul" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="rul" name="Predicted RUL" stroke="#06B6D4" fillOpacity={1} fill="url(#colorRul)" strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="health" name="Calc. Health" stroke="#10B981" strokeWidth={2} dot={false} />
              </AreaChart>
             ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Waiting for data stream...</div>
             )}
        </ChartCard>

        {/* 2. PIE CHART: Distribusi Risk */}
        <ChartCard id="chart-pie" title="Live Risk Distribution" icon={PieIcon}>
          <PieChart>
            <Pie
              data={chartData.pie}
              cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}
              dataKey="value" stroke="none"
            >
              {chartData.pie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" />
            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
              {rawTickets.length}
            </text>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-xs">
              Tickets
            </text>
          </PieChart>
        </ChartCard>

        {/* 3. BAR CHART: Failure Types */}
        <ChartCard id="chart-bar" title="Detected Failure Types" icon={BarChart2}>
          <BarChart data={chartData.bar} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} opacity={0.3} />
            <XAxis type="number" stroke="#9CA3AF" fontSize={10} hide />
            <YAxis dataKey="type" type="category" stroke="#D1D5DB" fontSize={10} width={90} tickLine={false} axisLine={false}/>
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#374151', opacity: 0.2}} />
            <Bar dataKey="count" name="Incidents" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.bar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06B6D4' : '#3B82F6'} />
                ))}
            </Bar>
          </BarChart>
        </ChartCard>

        {/* 4. COMPOSED CHART: Machine vs Sensor (Simulated) */}
        <ChartCard id="chart-composed" title="Vibration vs Pressure (Correlation)" icon={Zap}>
          <ComposedChart data={chartData.composed}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="id" stroke="#9CA3AF" fontSize={10} tickLine={false} interval={0} />
            <YAxis yAxisId="left" stroke="#8884d8" fontSize={10} tickLine={false} hide/>
            <YAxis yAxisId="right" orientation="right" stroke="#ff7300" fontSize={10} tickLine={false} hide/>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="pressure" name="Pressure (psi)" barSize={15} fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="vibration" name="Vibration" stroke="#ff7300" strokeWidth={2} dot={{r: 3}} />
          </ComposedChart>
        </ChartCard>

      </div>
    </div>
  );
};

export default Charts;