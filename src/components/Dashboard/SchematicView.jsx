import React from 'react';
import { Maximize2, MoreHorizontal } from 'lucide-react';

const SchematicView = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 md:p-6 h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white">
            Turbine XT-750
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-accent-success"></span>
            <span className="text-xs md:text-sm text-gray-400">
              Status: Normal
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 text-xs bg-dark-700 text-gray-300 rounded hover:bg-dark-600">
            Raw Data
          </button>
          <button className="px-3 py-1 text-xs bg-accent-cyan text-dark-900 font-bold rounded hover:opacity-90">
            Export Report
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        
        {/* SCHEMATIC */}
        <div className="flex-1 relative bg-[#0f172a] rounded-lg border border-dark-700 overflow-hidden">
          
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#4B5563 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 md:w-48 h-28 md:h-32 border-2 border-accent-cyan/50 rounded-full relative flex items-center justify-center">
              <div className="w-32 md:w-40 h-2 bg-accent-cyan/30 absolute"></div>
              <div className="w-2 h-20 md:h-24 bg-accent-cyan/30 absolute"></div>
              <span className="text-accent-cyan text-[10px] md:text-xs font-mono bg-dark-900 px-2 z-10">
                SCHEMATIC VIEW
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-dark-900/80 backdrop-blur px-3 py-2 rounded border border-dark-600 text-[10px] md:text-xs text-gray-300">
            <p>Rotation: 3,002 RPM</p>
            <p>Load: 82%</p>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-700 flex-1">
            <h4 className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
              7-Day Failure Probability
            </h4>

            <div className="flex items-center justify-center h-32">
              <div
                className="w-24 h-24 rounded-full relative flex items-center justify-center"
                style={{
                  background:
                    'conic-gradient(#10B981 0% 75%, #374151 75% 100%)'
                }}
              >
                <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-white">
                    Low
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              AI Prediction: Safe
            </p>
          </div>
        </div>
      </div>

      {/* SENSOR FOOTER */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorCard label="Vibration" value="0.12 g" status="normal" />
        <SensorCard label="Temperature" value="58 °C" status="normal" />
        <SensorCard label="Current" value="15.3 A" status="normal" />
      </div>
    </div>
  );
};

const SensorCard = ({ label, value, status }) => (
  <div className="bg-dark-700/30 p-3 rounded border border-dark-700 flex justify-between items-center">
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-base md:text-lg font-mono text-white">
        {value}
      </p>
    </div>
    <div
      className={`w-2 h-2 rounded-full ${
        status === 'normal'
          ? 'bg-accent-success'
          : 'bg-accent-danger'
      }`}
    />
  </div>
);

export default SchematicView;
