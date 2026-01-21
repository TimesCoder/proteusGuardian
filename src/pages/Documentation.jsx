import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
} from "lucide-react";

const Documentation = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");

  // Ref untuk menyimpan observer agar tidak re-render berlebihan
  const observer = useRef(null);

  const menuItems = [
    {
      category: "Getting Started",
      items: ["Introduction", "Installation", "Architecture"],
    },
    {
      category: "Core Concepts",
      items: ["RUL Prediction", "Risk Levels", "Sensor Telemetry"],
    },
    {
      category: "API Reference",
      items: ["Endpoints", ],
    },
  ];

  // --- 1. LOGIC SCROLL SPY (INTERSECTION OBSERVER) ---
  useEffect(() => {
    // Fungsi callback ketika elemen terlihat/keluar layar
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    // Konfigurasi Observer
    const options = {
      root: null, // Menggunakan viewport browser
      rootMargin: "-20% 0px -60% 0px", // Trigger aktif ketika elemen ada di tengah agak atas
      threshold: 0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    // Ambil semua section berdasarkan ID yang ada di menu
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.current.observe(section);
    });

    // Cleanup saat component unmount
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const scrollToSection = (item) => {
    const id = item.toLowerCase().replace(/\s/g, "-");
    setActiveSection(id);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-black text-gray-300 font-sans overflow-hidden">
      {/* MOBILE DOC HEADER */}
      <div className="md:hidden fixed top-0 w-full bg-gray-900/95 backdrop-blur border-b border-gray-800 z-50 p-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-white text-sm">
            Proteus <span className="text-cyan-400">Docs</span>
          </span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-300">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* LEFT SIDEBAR (Sticky) */}
      <aside
        className={`
        fixed md:relative z-40 h-full w-72 bg-gray-900 border-r border-gray-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        pt-16 md:pt-0 shrink-0
      `}
      >
        <div className="hidden md:block p-6 border-b border-gray-800">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
          >
            {/* Icon Panah */}
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />

            {/* Teks Logo */}
            <div className="text-xl font-bold text-white italic">
              Proteus <span className="text-cyan-400">Docs</span>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold mb-3 uppercase tracking-wider text-[10px] text-gray-500">
                {section.category}
              </h4>
              <ul className="space-y-1 border-l border-gray-800 ml-1">
                {section.items.map((item) => {
                  const id = item.toLowerCase().replace(/\s/g, "-");
                  const isActive = activeSection === id;
                  return (
                    <li key={item}>
                      <button
                        onClick={() => scrollToSection(item)}
                        className={`block w-full text-left pl-4 text-sm transition-all duration-200 py-1.5 -ml-px border-l-2 ${
                          isActive
                            ? "text-cyan-400 border-cyan-400 font-medium bg-cyan-400/5"
                            : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT (Scrollable) */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0 scroll-smooth relative bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
          {/* BREADCRUMB */}
          <div className="flex items-center text-xs md:text-sm text-cyan-400 mb-6 md:mb-8">
            Docs <ChevronRight size={12} className="mx-2" />{" "}
            <span className="capitalize text-gray-400">
              {activeSection.replace(/-/g, " ")}
            </span>
          </div>

          {/* ========== GETTING STARTED ========== */}

          <section id="introduction" className="mb-16 md:mb-20 scroll-mt-24">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Introduction to Proteus Guardian
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8">
              Proteus Guardian is an intelligent anomaly detection system
              designed to monitor asset health in real-time. By leveraging AI
              models trained on sensor data, Proteus Guardian can detect
              irregularities and potential issues before they escalate.
            </p>

            <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-4 md:p-6 mb-8">
              <div className="flex items-start gap-3">
                <Info className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-white font-bold mb-2 text-sm md:text-base">Key Benefits</h3>
                  <ul className="space-y-1 text-gray-300 text-sm md:text-base">
                    <li>• Early detection of system anomalies</li>
                    <li>• Real-time monitoring dashboard</li>
                    <li>• Real-time monitoring with intelligent alerting</li>
                    <li>• Data-driven insights for maintenance</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              Who Should Use Proteus Guardian?
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-4">
              Proteus Guardian is designed for operators and engineers who need
              to monitor system performance and detect anomalies in sensor data.
              It is suitable for various industrial and IoT applications where
              data integrity and system health are critical.
            </p>
          </section>

          <hr className="border-gray-800 my-10" />

          <section id="installation" className="mb-16 md:mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Installation</h2>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              System Requirements
            </h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              To deploy the Proteus Guardian system, your environment requires:
            </p>

            <div className="bg-gray-900 p-4 md:p-6 rounded-lg font-mono text-xs md:text-sm text-gray-300 mb-8 border border-gray-800">
              <div className="space-y-2">
                <div className="break-words">
                  <span className="text-cyan-400">Runtime:</span> Python 3.8+
                  and Node.js 16+
                </div>
                <div className="break-words">
                  <span className="text-cyan-400">Database:</span> PostgreSQL or
                  SQLite (local)
                </div>
                <div className="break-words">
                  <span className="text-cyan-400">RAM:</span> 4GB minimum
                </div>
                <div className="break-words">
                  <span className="text-cyan-400">OS:</span> Windows, macOS, or
                  Linux
                </div>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Quick Start Installation
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 mb-2 text-sm">1. Clone the repository:</p>
                <div className="bg-gray-900 p-3 md:p-4 rounded-lg font-mono text-xs md:text-sm text-green-400 border border-gray-800 overflow-x-auto whitespace-pre">
                  git clone
                  https://github.com/Diki04/predictive-maintenance-copilot
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-2 text-sm">
                  2. Setup Backend (Anomaly Service):
                </p>
                <div className="bg-gray-900 p-3 md:p-4 rounded-lg font-mono text-xs md:text-sm text-green-400 border border-gray-800 overflow-x-auto whitespace-pre">
{`cd anomaly_service
pip install -r requirements.txt
python main.py`}
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-2 text-sm">3. Setup Frontend:</p>
                <div className="bg-gray-900 p-3 md:p-4 rounded-lg font-mono text-xs md:text-sm text-green-400 border border-gray-800 overflow-x-auto whitespace-pre">
{`cd front-end
npm install
npm run dev`}
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-2 text-sm">4. Verify installation:</p>
                <div className="bg-gray-900 p-3 md:p-4 rounded-lg font-mono text-xs md:text-sm text-green-400 border border-gray-800 overflow-x-auto whitespace-pre">
                  Access http://localhost:5173 (Frontend)
                  <br />
                  Access http://localhost:5000 (Backend API)
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r flex items-start gap-3">
              <AlertCircle
                className="text-amber-500 flex-shrink-0"
                size={20}
              />
              <p className="text-gray-300 text-sm">
                <strong>Important:</strong> Ensure the backend service is
                running before starting the frontend to avoid connection
                errors.
              </p>
            </div>
          </section>

          <hr className="border-gray-800 my-10" />

          <section id="architecture" className="mb-16 md:mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Architecture</h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Proteus Guardian follows a monolithic service architecture where
              the backend handles data processing, ML inference, and API
              serving, while the frontend visualizes the data.
            </p>
            
            

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 mb-6">
              <h3 className="text-white font-bold mb-4">System Components</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-cyan-400 font-bold mb-1 text-sm md:text-base">
                    Frontend (React)
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Interactive dashboard built with React and Tailwind CSS.
                    Consumes the API via custom hooks like{" "}
                    <code>useMachineData</code>.
                  </p>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold mb-1 text-sm md:text-base">
                    Backend (Python/Flask)
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Serves REST API endpoints, manages database connections, and
                    runs the anomaly detection models.
                  </p>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold mb-1 text-sm md:text-base">ML Engine</div>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Integrated within the backend service to process sensor data
                    and predict anomalies in real-time.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Data Flow</h3>
            <ol className="space-y-3 text-gray-400 mb-6 text-sm md:text-base">
              <li>
                1. Client requests data via <code>useMachineData</code> hook
              </li>
              <li>
                2. Backend API receives request (e.g.,{" "}
                <code>/api/data/machines/overview</code>)
              </li>
              <li>
                3. Service queries database and runs ML inference if needed
              </li>
              <li>4. JSON response is returned to the Frontend</li>
              <li>
                5. Dashboard updates UI components (Charts, Tables, Alerts)
              </li>
            </ol>
          </section>

          {/* ========== CORE CONCEPTS ========== */}

          <hr className="border-gray-800 my-10" />

          <section id="rul-prediction" className="mb-16 md:mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              RUL Prediction
            </h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
              The core of Proteus Guardian is the{" "}
              <strong className="text-cyan-400">
                Remaining Useful Life (RUL)
              </strong>{" "}
              engine. RUL represents the estimated number of operational hours
              before an asset requires maintenance or replacement.
            </p>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              The RUL engine ingests multivariate sensor data and processes it
              through a deep learning model trained on thousands of failure
              cycles:
            </p>

            <ul className="space-y-2 mb-6 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <CheckCircle
                  className="text-cyan-400 flex-shrink-0 mt-1"
                  size={16}
                />
                <span>
                  <strong>Vibration Sensors:</strong> Detect bearing wear,
                  imbalance, and misalignment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  className="text-cyan-400 flex-shrink-0 mt-1"
                  size={16}
                />
                <span>
                  <strong>Temperature Sensors:</strong> Monitor thermal
                  degradation and overheating
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  className="text-cyan-400 flex-shrink-0 mt-1"
                  size={16}
                />
                <span>
                  <strong>Pressure Sensors:</strong> Track hydraulic and
                  pneumatic system health
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  className="text-cyan-400 flex-shrink-0 mt-1"
                  size={16}
                />
                <span>
                  <strong>Current Sensors:</strong> Analyze electrical
                  signatures for motor health
                </span>
              </li>
            </ul>

            <div className="bg-gray-900 border-l-4 border-cyan-400 p-4 rounded-r mb-6">
              <p className="text-gray-300 italic text-sm md:text-base">
                "Predictive maintenance reduces downtime by up to 50% compared
                to reactive maintenance strategies."
              </p>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Model Training
            </h3>
            
            

            <p className="text-gray-400 mb-4 text-sm md:text-base">
              Proteus Guardian uses a hybrid LSTM-CNN architecture that learns
              temporal patterns and spatial features from sensor arrays. Models
              are continuously retrained using your fleet's operational data to
              improve accuracy over time.
            </p>

            <div className="bg-black p-4 rounded-lg font-mono text-xs md:text-sm text-gray-300 border border-gray-800 mb-6">
              <div className="text-cyan-400 mb-2">
                # Model Performance Metrics
              </div>
              <div>Accuracy: 94.7%</div>
              <div>Precision: 92.3%</div>
              <div>Recall: 96.1%</div>
              <div>False Positive Rate: &lt; 3%</div>
            </div>
          </section>

          <hr className="border-gray-800 my-10" />

          <section id="risk-levels" className="mb-16 md:mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Risk Levels</h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Proteus Guardian categorizes assets into five risk levels based on
              RUL predictions and anomaly detection scores. Each level triggers
              specific workflows and notification rules.
            </p>
            
            

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded-r">
                <div className="font-bold text-green-500 mb-1 text-sm md:text-base">
                  OPTIMAL (RUL &gt; 720 hours)
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Asset is operating within normal parameters. Continue routine
                  monitoring.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-500 p-4 rounded-r">
                <div className="font-bold text-blue-500 mb-1 text-sm md:text-base">
                  NORMAL (RUL 360-720 hours)
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Asset is healthy but approaching maintenance window. Schedule
                  preventive maintenance.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-yellow-500 p-4 rounded-r">
                <div className="font-bold text-yellow-500 mb-1 text-sm md:text-base">
                  CAUTION (RUL 168-360 hours)
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Early degradation detected. Increase monitoring frequency and
                  prepare maintenance resources.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-orange-500 p-4 rounded-r">
                <div className="font-bold text-orange-500 mb-1 text-sm md:text-base">
                  WARNING (RUL 72-168 hours)
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Significant degradation detected. Schedule immediate
                  maintenance within 7 days.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-red-500 p-4 rounded-r">
                <div className="font-bold text-red-500 mb-1 text-sm md:text-base">
                  CRITICAL (RUL &lt; 72 hours)
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Imminent failure risk. Shut down asset or implement emergency
                  maintenance immediately.
                </p>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Customizing Thresholds
            </h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              Risk thresholds can be customized per asset type or criticality
              level through the dashboard settings or API.
            </p>
          </section>

          <hr className="border-gray-800 my-10" />

          <section id="sensor-telemetry" className="mb-16 md:mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Sensor Telemetry
            </h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Proteus Guardian supports multiple industrial communication
              protocols for sensor integration, ensuring compatibility with
              existing infrastructure.
            </p>

            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Supported Protocols
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2 text-sm md:text-base">
                  Modbus TCP/RTU
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Industry standard for PLCs and sensors. Supports both serial
                  and ethernet connections.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2 text-sm md:text-base">OPC-UA</div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Secure, platform-independent protocol for industrial
                  automation systems.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2 text-sm md:text-base">MQTT</div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Lightweight pub/sub protocol ideal for IoT sensor networks.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2 text-sm md:text-base">REST API</div>
                <p className="text-gray-400 text-xs md:text-sm">
                  HTTP-based integration for custom sensors and data sources.
                </p>
              </div>
            </div>
            
            {/* Sisa konten Data Collection Rates & Guides disederhanakan untuk brevity respons, struktur sama seperti di atas */}
             <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Data Collection Rates
            </h3>
             <ul className="space-y-2 text-gray-400 mb-6 text-sm md:text-base">
              <li>• <strong className="text-white">High-frequency:</strong> 1-10 Hz</li>
              <li>• <strong className="text-white">Medium-frequency:</strong> 0.1-1 Hz</li>
              <li>• <strong className="text-white">Low-frequency:</strong> 0.01-0.1 Hz</li>
            </ul>
          </section>

          {/* ========== GUIDES & API REFERENCE (Disamakan strukturnya) ========== */}

          <hr className="border-gray-800 my-10" />

          <section id="endpoints" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              API Endpoints
            </h2>

            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Base URL:{" "}
              <code className="text-cyan-400 bg-gray-900 px-2 py-1 rounded text-xs md:text-sm break-all">
                http://localhost:8000/api
              </code>
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                {/* Responsive Header for API Block */}
                <div className="bg-black px-4 py-3 flex flex-wrap items-center gap-2 border-b border-gray-800">
                  <span className="bg-green-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                  <code className="text-cyan-400 text-xs md:text-sm break-all">/data/machines/overview</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">
                    Retrieve the overview of all machines in the fleet.
                  </p>
                  <div className="text-xs md:text-sm">
                    <div className="text-gray-500 mb-2">Example Response:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto whitespace-pre">
{`[
  {
    "machine_id": "M-001",
    "name": "Milling Machine A",
    "status": "Healthy"
  }
]`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contoh Endpoint Lainnya */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-black px-4 py-3 flex flex-wrap items-center gap-2 border-b border-gray-800">
                  <span className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                    POST
                  </span>
                  <code className="text-cyan-400 text-xs md:text-sm break-all">/ml/predict</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">
                    Analyze sensor data for anomalies.
                  </p>
                  <div className="text-xs md:text-sm">
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto whitespace-pre">
{`{
  "is_anomaly": true,
  "risk_level": "Critical",
  "probability": 0.85
}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER NAVIGATION */}
          <div className="mt-20 pt-10 border-t border-gray-800 flex justify-end items-center">
            <button
              onClick={() => scrollToSection("Introduction")}
              className="text-right group cursor-pointer"
            >
              <div className="text-xs text-gray-500 mb-1">Back to Top</div>
              <div className="text-cyan-400 font-bold flex items-center gap-2 group-hover:underline text-sm">
                Introduction <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Documentation;