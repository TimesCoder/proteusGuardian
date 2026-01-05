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
      category: "Guides",
      items: ["Generating Reports", "Fleet Management", "Connecting Sensors"],
    },
    {
      category: "API Reference",
      items: ["Endpoints", "Authentication", "Errors"],
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
    // Set manual dulu biar instan feedback
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
      <div className="md:hidden fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-white">
            Proteus <span className="text-cyan-400">Guardian</span> Docs
          </span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* LEFT SIDEBAR (Sticky) */}
      <aside
        className={`
        fixed md:relative z-40 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col
        transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0
        pt-16 md:pt-0 shrink-0
      `}
      >
        <div className="p-6 border-b border-gray-800">
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
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-[10px] text-gray-500">
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
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0 scroll-smooth relative">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          {/* BREADCRUMB */}
          <div className="flex items-center text-sm text-cyan-400 mb-8">
            Docs <ChevronRight size={14} className="mx-2" />{" "}
            <span className="capitalize">
              {activeSection.replace("-", " ")}
            </span>
          </div>

          {/* ========== GETTING STARTED ========== */}

          {/* PERUBAHAN: Tambahkan class 'scroll-mt-24' agar judul tidak ketutupan header saat discroll */}

          <section id="introduction" className="mb-20 scroll-mt-24">
            <h1 className="text-4xl font-bold text-white mb-6">
              Introduction to Proteus Guardian
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Proteus Guardian is an intelligent anomaly detection system
              designed to monitor asset health in real-time. By leveraging AI
              models trained on sensor data, Proteus Guardian can detect
              irregularities and potential issues before they escalate.
            </p>

            <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Info className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-white font-bold mb-2">Key Benefits</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Early detection of system anomalies</li>
                    <li>• Real-time monitoring dashboard</li>
                    <li>• Real-time monitoring with intelligent alerting</li>
                    <li>• Data-driven insights for maintenance</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Who Should Use Proteus Guardian?
            </h3>
            <p className="text-gray-400 mb-4">
              Proteus Guardian is designed for operators and engineers who need
              to monitor system performance and detect anomalies in sensor data.
              It is suitable for various industrial and IoT applications where
              data integrity and system health are critical.
            </p>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="installation" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>

            <h3 className="text-xl font-bold text-white mb-4">
              System Requirements
            </h3>
            <p className="text-gray-400 mb-4">
              To deploy the Proteus Guardian system, your environment requires:
            </p>

            <div className="bg-gray-900 p-6 rounded-lg font-mono text-sm text-gray-300 mb-8 border border-gray-800">
              <div className="space-y-2">
                <div>
                  <span className="text-cyan-400">Runtime:</span> Python 3.8+
                  and Node.js 16+
                </div>
                <div>
                  <span className="text-cyan-400">Database:</span> PostgreSQL or
                  SQLite (local)
                </div>
                <div>
                  <span className="text-cyan-400">RAM:</span> 4GB minimum
                </div>
                <div>
                  <span className="text-cyan-400">OS:</span> Windows, macOS, or
                  Linux
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Quick Start Installation
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 mb-3">1. Clone the repository:</p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  git clone
                  https://github.com/Diki04/predictive-maintenance-copilot
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-3">
                  2. Setup Backend (Anomaly Service):
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  cd anomaly_service
                  <br />
                  pip install -r requirements.txt
                  <br />
                  python main.py
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-3">3. Setup Frontend:</p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  cd front-end
                  <br />
                  npm install
                  <br />
                  npm run dev
                </div>
              </div>

              <div>
                <p className="text-gray-400 mb-3">4. Verify installation:</p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  Access http://localhost:5173 (Frontend)
                  <br />
                  Access http://localhost:5000 (Backend API)
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-amber-500 flex-shrink-0"
                  size={20}
                />
                <p className="text-gray-300">
                  <strong>Important:</strong> Ensure the backend service is
                  running before starting the frontend to avoid connection
                  errors.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="architecture" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">Architecture</h2>

            <p className="text-gray-400 mb-6">
              Proteus Guardian follows a monolithic service architecture where
              the backend handles data processing, ML inference, and API
              serving, while the frontend visualizes the data.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-white font-bold mb-4">System Components</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-cyan-400 font-bold mb-1">
                    Frontend (React)
                  </div>
                  <p className="text-gray-400 text-sm">
                    Interactive dashboard built with React and Tailwind CSS.
                    Consumes the API via custom hooks like{" "}
                    <code>useMachineData</code>.
                  </p>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold mb-1">
                    Backend (Python/Flask)
                  </div>
                  <p className="text-gray-400 text-sm">
                    Serves REST API endpoints, manages database connections, and
                    runs the anomaly detection models.
                  </p>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold mb-1">ML Engine</div>
                  <p className="text-gray-400 text-sm">
                    Integrated within the backend service to process sensor data
                    and predict anomalies in real-time.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Data Flow</h3>
            <ol className="space-y-3 text-gray-400 mb-6">
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

          <hr className="border-gray-800 my-12" />

          <section id="rul-prediction" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              RUL Prediction
            </h2>

            <p className="text-gray-400 mb-6">
              The core of Proteus Guardian is the{" "}
              <strong className="text-cyan-400">
                Remaining Useful Life (RUL)
              </strong>{" "}
              engine. RUL represents the estimated number of operational hours
              before an asset requires maintenance or replacement.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-gray-400 mb-4">
              The RUL engine ingests multivariate sensor data and processes it
              through a deep learning model trained on thousands of failure
              cycles:
            </p>

            <ul className="space-y-2 mb-6 text-gray-400">
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
              <p className="text-gray-300 italic">
                "Predictive maintenance reduces downtime by up to 50% compared
                to reactive maintenance strategies."
              </p>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Model Training
            </h3>
            <p className="text-gray-400 mb-4">
              Proteus Guardian uses a hybrid LSTM-CNN architecture that learns
              temporal patterns and spatial features from sensor arrays. Models
              are continuously retrained using your fleet's operational data to
              improve accuracy over time.
            </p>

            <div className="bg-black p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800 mb-6">
              <div className="text-cyan-400 mb-2">
                # Model Performance Metrics
              </div>
              <div>Accuracy: 94.7%</div>
              <div>Precision: 92.3%</div>
              <div>Recall: 96.1%</div>
              <div>False Positive Rate: &lt; 3%</div>
            </div>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="risk-levels" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">Risk Levels</h2>

            <p className="text-gray-400 mb-6">
              Proteus Guardian categorizes assets into five risk levels based on
              RUL predictions and anomaly detection scores. Each level triggers
              specific workflows and notification rules.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded-r">
                <div className="font-bold text-green-500 mb-1">
                  OPTIMAL (RUL &gt; 720 hours)
                </div>
                <p className="text-gray-400 text-sm">
                  Asset is operating within normal parameters. Continue routine
                  monitoring.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-500 p-4 rounded-r">
                <div className="font-bold text-blue-500 mb-1">
                  NORMAL (RUL 360-720 hours)
                </div>
                <p className="text-gray-400 text-sm">
                  Asset is healthy but approaching maintenance window. Schedule
                  preventive maintenance.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-yellow-500 p-4 rounded-r">
                <div className="font-bold text-yellow-500 mb-1">
                  CAUTION (RUL 168-360 hours)
                </div>
                <p className="text-gray-400 text-sm">
                  Early degradation detected. Increase monitoring frequency and
                  prepare maintenance resources.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-orange-500 p-4 rounded-r">
                <div className="font-bold text-orange-500 mb-1">
                  WARNING (RUL 72-168 hours)
                </div>
                <p className="text-gray-400 text-sm">
                  Significant degradation detected. Schedule immediate
                  maintenance within 7 days.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-red-500 p-4 rounded-r">
                <div className="font-bold text-red-500 mb-1">
                  CRITICAL (RUL &lt; 72 hours)
                </div>
                <p className="text-gray-400 text-sm">
                  Imminent failure risk. Shut down asset or implement emergency
                  maintenance immediately.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Customizing Thresholds
            </h3>
            <p className="text-gray-400 mb-4">
              Risk thresholds can be customized per asset type or criticality
              level through the dashboard settings or API.
            </p>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="sensor-telemetry" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Sensor Telemetry
            </h2>

            <p className="text-gray-400 mb-6">
              Proteus Guardian supports multiple industrial communication
              protocols for sensor integration, ensuring compatibility with
              existing infrastructure.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">
              Supported Protocols
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">
                  Modbus TCP/RTU
                </div>
                <p className="text-gray-400 text-sm">
                  Industry standard for PLCs and sensors. Supports both serial
                  and ethernet connections.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">OPC-UA</div>
                <p className="text-gray-400 text-sm">
                  Secure, platform-independent protocol for industrial
                  automation systems.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">MQTT</div>
                <p className="text-gray-400 text-sm">
                  Lightweight pub/sub protocol ideal for IoT sensor networks.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">REST API</div>
                <p className="text-gray-400 text-sm">
                  HTTP-based integration for custom sensors and data sources.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Data Collection Rates
            </h3>
            <p className="text-gray-400 mb-4">
              Proteus Guardian supports configurable sampling rates based on
              asset criticality:
            </p>

            <ul className="space-y-2 text-gray-400 mb-6">
              <li>
                • <strong className="text-white">High-frequency:</strong> 1-10
                Hz (vibration analysis, acoustic monitoring)
              </li>
              <li>
                • <strong className="text-white">Medium-frequency:</strong>{" "}
                0.1-1 Hz (temperature, pressure, flow)
              </li>
              <li>
                • <strong className="text-white">Low-frequency:</strong>{" "}
                0.01-0.1 Hz (environmental conditions)
              </li>
            </ul>
          </section>

          {/* ========== GUIDES ========== */}

          <hr className="border-gray-800 my-12" />

          <section id="generating-reports" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Generating Reports
            </h2>

            <p className="text-gray-400 mb-6">
              Proteus Guardian provides reporting capabilities to analyze
              performance and anomaly history.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Report Types</h3>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">
                  Asset Health Report
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Detailed analysis of individual asset performance, including
                  anomaly trends and history.
                </p>
                <div className="text-xs text-gray-500">
                  Available formats: PDF, Excel, JSON
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                <div className="text-cyan-400 font-bold mb-2">
                  Fleet Overview
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Executive summary of all monitored assets, risk distribution,
                  and maintenance schedule overview.
                </p>
                <div className="text-xs text-gray-500">
                  Available formats: PDF, PowerPoint
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Automated Scheduling
            </h3>
            <p className="text-gray-400 mb-4">
              Configure automatic report generation and distribution via the
              Reports settings page:
            </p>

            <div className="bg-black p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800 mb-6">
              <div className="text-cyan-400 mb-1">Schedule Options:</div>
              <div>• Daily summaries at 08:00 local time</div>
              <div>• Weekly reports every Monday</div>
              <div>• Monthly executive summaries</div>
              <div>• On-demand via API or dashboard</div>
            </div>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="fleet-management" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Fleet Management
            </h2>

            <p className="text-gray-400 mb-6">
              Manage multiple assets and groups from a unified dashboard
              interface.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">
              Organizing Your Fleet
            </h3>

            <div className="space-y-3 text-gray-400 mb-6">
              <div>
                <strong className="text-white">Sites:</strong> Organize assets
                by physical location (plants, facilities, regions)
              </div>
              <div>
                <strong className="text-white">Groups:</strong> Create logical
                collections (production line, backup systems, critical assets)
              </div>
              <div>
                <strong className="text-white">Tags:</strong> Apply flexible
                labels for cross-cutting classification (vendor, age,
                criticality)
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              Bulk Operations
            </h3>
            <p className="text-gray-400 mb-4">
              Perform actions across multiple assets simultaneously:
            </p>

            <ul className="space-y-2 text-gray-400 mb-6">
              <li>• Update risk thresholds for entire asset groups</li>
              <li>• Schedule maintenance windows across sites</li>
              <li>• Configure alert rules for multiple assets</li>
              <li>• Export data for compliance reporting</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4">
              Team Collaboration
            </h3>
            <p className="text-gray-400 mb-4">
              Assign role-based access and responsibilities:
            </p>

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg mb-6">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cyan-400 font-bold">Admin:</span>{" "}
                  <span className="text-gray-400">
                    Full system access and configuration
                  </span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">
                    Maintenance Manager:
                  </span>{" "}
                  <span className="text-gray-400">
                    Schedule maintenance, view all assets
                  </span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">Technician:</span>{" "}
                  <span className="text-gray-400">
                    View assigned assets, update work orders
                  </span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">Viewer:</span>{" "}
                  <span className="text-gray-400">
                    Read-only dashboard access
                  </span>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="connecting-sensors" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Connecting Sensors
            </h2>

            <p className="text-gray-400 mb-6">
              Step-by-step guide to connecting your first sensor to the Proteus
              Guardian system.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
            <ul className="space-y-2 text-gray-400 mb-6">
              <li>• Anomaly Service installed and running</li>
              <li>• Sensor hardware installed and powered</li>
              <li>• Network connectivity between sensor and edge device</li>
              <li>• Sensor documentation (protocol, address, registers)</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4">
              Configuration Steps
            </h3>

            <div className="space-y-6 mb-6">
              <div>
                <div className="text-white font-bold mb-2">
                  Step 1: Create Asset Profile
                </div>
                <p className="text-gray-400 mb-3">
                  Navigate to Assets → Add New Asset and configure:
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800">
                  Name: Turbine-001
                  <br />
                  Type: Rotating Equipment
                  <br />
                  Location: Plant A, Building 2<br />
                  Criticality: High
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2">
                  Step 2: Add Sensor Configuration
                </div>
                <p className="text-gray-400 mb-3">
                  Click on asset → Sensors → Add Sensor:
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800">
                  Protocol: HTTP/REST
                  <br />
                  Endpoint: /api/sensors/data
                  <br />
                  Data Type: Float32
                  <br />
                  Sampling Rate: 1 Hz
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2">
                  Step 3: Test Connection
                </div>
                <p className="text-gray-400 mb-3">
                  Use the built-in diagnostic tool:
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  # Example test command
                  <br />
                  curl -X POST http://localhost:8000/api/test ...
                  <br />
                  <span className="text-gray-400">
                    ✓ Connection successful
                    <br />✓ Data received: 72.3°C
                  </span>
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2">
                  Step 4: Enable Monitoring
                </div>
                <p className="text-gray-400 mb-3">
                  Activate the sensor and start data collection:
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800">
                  # Enable via Dashboard
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 flex-shrink-0"
                  size={20}
                />
                <p className="text-gray-300">
                  <strong>Success!</strong> Your sensor is now connected and
                  streaming data. View real-time telemetry in the asset
                  dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* ========== API REFERENCE ========== */}

          <hr className="border-gray-800 my-12" />

          <section id="endpoints" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              API Endpoints
            </h2>

            <p className="text-gray-400 mb-6">
              The Proteus Guardian API provides programmatic access to platform
              features. Base URL:{" "}
              <code className="text-cyan-400 bg-gray-900 px-2 py-1 rounded">
                http://localhost:8000/api
              </code>
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Assets</h3>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-black px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                  <code className="text-cyan-400">/data/machines/overview</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Retrieve the overview of all machines in the fleet.
                  </p>
                  <div className="text-sm mb-3">
                    <div className="text-gray-500 mb-2">Query Parameters:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs space-y-1">
                      <div>
                        <span className="text-gray-500">None</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-500 mb-2">Example Response:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
                      {`{
  [
    {
      "machine_id": "M-001",
      "name": "Milling Machine A",
      "status": "Healthy",
      "last_updated": "2023-10-27T10:00:00Z"
    }
  ]
}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-black px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                  <code className="text-cyan-400">/data/dashboard/stats</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Get aggregated statistics for the dashboard.
                  </p>
                  <div className="text-sm">
                    <div className="text-gray-500 mb-2">Example Response:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
                      {`{
  "total_machines": 50,
  "active_anomalies": 3,
  "avg_uptime": 98.5,
  "maintenance_due": 5
}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-black px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                  <code className="text-cyan-400">
                    /data/machines/{`{machine_id}`}/live_sensor
                  </code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Get live sensor data for a specific machine.
                  </p>
                  <div className="text-sm">
                    <div className="text-gray-500 mb-2">Example Response:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
                      {`{
  "machine_id": "M-001",
  "timestamp": "2023-10-27T10:15:00Z",
  "rpm": 1420,
  "temperature": 305.2,
  "torque": 40.1
}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-black px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    POST
                  </span>
                  <code className="text-cyan-400">/ml/predict</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Analyze sensor data for anomalies.
                  </p>
                  <div className="text-sm">
                    <div className="text-gray-500 mb-2">Example Response:</div>
                    <div className="bg-black p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
                      {`{
  "is_anomaly": true,
  "failure_type": "Power Failure",
  "probability": 0.85,
  "risk_level": "Critical",
  "recomendation": "Check power supply.",
  "root_cause": [
    "High Torque (65.0 Nm)"
  ]
}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other endpoint sections similarly structured... */}
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="authentication" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Authentication
            </h2>

            <p className="text-gray-400 mb-6">
              The API supports token-based authentication. For development
              environments, authentication might be disabled or handled via
              session cookies.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">
              Getting Your API Key
            </h3>
            <ol className="space-y-2 text-gray-400 mb-6">
              <li>1. Contact the system administrator</li>
              <li>2. Request an API Access Token</li>
              <li>3. Store the token securely</li>
            </ol>

            <h3 className="text-xl font-bold text-white mb-4">
              Making Authenticated Requests
            </h3>
            <p className="text-gray-400 mb-4">
              Include your token in the Authorization header with the Bearer
              scheme:
            </p>

            <div className="bg-black p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800 mb-6 overflow-x-auto">
              {`curl http://localhost:8000/api/data/machines/overview \\
  -H "Authorization: Bearer your_token_here" \\
  -H "Content-Type: application/json"`}
            </div>
          </section>

          <hr className="border-gray-800 my-12" />

          <section id="errors" className="mb-20 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">
              Error Handling
            </h2>

            <p className="text-gray-400 mb-6">
              The API uses conventional HTTP response codes to indicate success
              or failure. Error responses include a JSON body with details.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">
              HTTP Status Codes
            </h3>

            <div className="space-y-3 mb-8">
              <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded-r">
                <div className="font-bold text-green-500 mb-1">200 OK</div>
                <p className="text-gray-400 text-sm">Request succeeded</p>
              </div>
              <div className="bg-gray-900 border-l-4 border-yellow-500 p-4 rounded-r">
                <div className="font-bold text-yellow-500 mb-1">
                  400 Bad Request
                </div>
                <p className="text-gray-400 text-sm">
                  Invalid request parameters or malformed JSON
                </p>
              </div>
              <div className="bg-gray-900 border-l-4 border-red-500 p-4 rounded-r">
                <div className="font-bold text-red-500 mb-1">
                  500 Internal Server Error
                </div>
                <p className="text-gray-400 text-sm">
                  Something went wrong on our end
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER NAVIGATION */}
          <div className="mt-20 pt-10 border-t border-gray-800 flex justify-between items-center">
            <div></div>
            <a
              href="#introduction"
              onClick={() => scrollToSection("Introduction")}
              className="text-right group cursor-pointer"
            >
              <div className="text-xs text-gray-500 mb-1">Back to Top</div>
              <div className="text-cyan-400 font-bold flex items-center gap-2 group-hover:underline">
                Introduction <ChevronRight size={16} />
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Documentation;
