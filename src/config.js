// File: src/config.js (FINAL - FULL ENDPOINT MAPPING)

// Konfigurasi Central untuk API URL
// Default mengarah ke Server DigitalOcean.
// Jika ingin run lokal, buat file .env di root frontend dengan isi: VITE_API_BASE_URL=http://localhost:8000

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://copilot-nwt2l.ondigitalocean.app';

export const CONFIG = {
    API_BASE_URL: API_BASE_URL,
    
    ENDPOINTS: {
        // --- DATA ENDPOINTS (Dashboard & Monitoring) ---
        // Base path untuk data. Penggunaan di code: `${DATA}/tickets` atau `${DATA}/machines/overview`
        DATA: `${API_BASE_URL}/api/data`, 

        // --- INTELLIGENCE ENDPOINTS ---
        // Endpoint Chat (LLM Agent)
        CHAT: `${API_BASE_URL}/api/chat/message`,

        // Endpoint Machine Learning (Inference Tester)
        // Digunakan di MLTester.jsx
        ML_PREDICT: `${API_BASE_URL}/api/ml/predict`,
        ML_PREDICTs: `${API_BASE_URL}/predict`,
        // --- ADMIN & MLOPS ENDPOINTS ---
        // Endpoint untuk mengirim Feedback manual (Create Ticket Labeling)
        // Digunakan di FeedbackForm.jsx
        ADMIN_FEEDBACK: `${API_BASE_URL}/api/admin/feedback`,

        // Endpoint untuk memicu Retraining Model
        // Digunakan di RetrainControl.jsx
        ADMIN_RETRAIN: `${API_BASE_URL}/api/admin/retrain`,
        
        // Endpoint Manajemen Aset (CRUD Mesin / Static Info)
        // Digunakan di MachineDetail.jsx untuk ambil info statis (lokasi, tipe, gambar)
        ADMIN_ASSETS: `${API_BASE_URL}/api/admin/assets`,
    }
};

// Log status koneksi agar terlihat di Console Browser (F12)
console.log(`%c🔌 Connected to Backend: ${CONFIG.API_BASE_URL}`, "color: #06B6D4; font-weight: bold; font-size: 12px;");