import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useAuth } from "../context/AuthContext";
// Import Swiper React components & CSS
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  Target,
  Zap,
  Globe,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Users,
  ChevronLeft,
  Instagram,
  Menu, // Added icon if needed for future menu
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// --- DATA TIM (5 ORANG) ---
const teamMembers = [
  {
    name: "Mohammad Ari Alexander Aziz",
    role: "Project Manager",
    img: "/team/ari.png",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/ariaziz/",
    github: "https://github.com/13222093",
  },
  {
    name: "Joshua Bulyan Zebua",
    role: "Lead Backend Engineer",
    img: "/team/joshua.png",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/joshuabulyanzebua/",
    github: "https://github.com/TimesCoder",
  },
  {
    name: "Rizkillah Ramanda Sinyo",
    role: "Lead Machine Learning Engineer",
    img: "/team/rizkillah.jpg",
    ig: "https://www.instagram.com/rizkillahramandaa/",
    linkedin: "https://www.linkedin.com/in/rizkillah-ramanda-sinyo/",
    github: "https://github.com/Diki04",
  },
  {
    name: "Amanda Grace Patricia Sinurat",
    role: "Frontend Engineer",
    img: "/team/amanda.jpeg",
    ig: "https://www.instagram.com/amandasinurat_",
    linkedin: "https://www.linkedin.com/in/amanda-grace-342530255/",
    github: "https://github.com/",
  },
  {
    name: "Lusiana Novika Togatorop",
    role: "Backend Engineer",
    img: "/team/lusi.png",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/lusiana-novika-togatorop-9427ab257/",
    github: "https://github.com/",
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Custom CSS untuk Pagination Swiper
const swiperStyleCSS = `
  .swiper-pagination-bullet { background-color: #4b5563; opacity: 1; }
  .swiper-pagination-bullet-active { background-color: #06b6d4; width: 24px; border-radius: 8px; transition: all 0.3s; }
  /* Padding adjustment for mobile swiper */
  .swiper-wrapper { padding-bottom: 10px; }
`;

const AboutUs = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleStartPilot = async () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      try {
        await loginWithGoogle();
        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans overflow-x-hidden selection:bg-accent-cyan selection:text-black">
      <style>{swiperStyleCSS}</style>

      {/* --- NAVBAR --- */}
      <nav className="absolute top-0 left-0 w-full z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group bg-dark-900/50 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-full border border-white/10 hover:border-accent-cyan/50"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform text-accent-cyan"
          />
          <span className="text-xs md:text-sm font-bold tracking-wide">
            Back to Home
          </span>
        </Link>

        {/* Logo Hidden on Small Mobile, Visible on Tablet+ */}
        <div className="hidden sm:block text-lg font-bold italic text-white/80">
          Proteus <span className="text-accent-cyan">Guardian</span>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 md:py-36 px-4 md:px-6 overflow-hidden flex flex-col justify-center items-center min-h-[60vh] md:min-h-screen">
        {/* Background Glow Responsive Size */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-r from-accent-cyan/20 to-blue-600/20 blur-[80px] md:blur-[150px] rounded-full -z-10 opacity-70 origin-center"
        ></motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-10 mt-10 md:mt-0">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8 text-[10px] md:text-xs font-bold tracking-widest text-accent-cyan uppercase bg-dark-800/80 backdrop-blur rounded-full border border-accent-cyan/30 shadow-lg shadow-accent-cyan/10"
            >
              <Users size={12} className="md:w-3.5 md:h-3.5" /> Who We Are
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 tracking-tight leading-tight"
            >
              We Secure The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-purple-500 animate-gradient-x">
                Industrial Future.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-base sm:text-lg md:text-2xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light px-2"
            >
              Proteus Guardian bridges the gap between raw sensor data and
              actionable AI intelligence. We predict failures before they
              happen, so your world never stops running.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-10 md:py-12 border-y border-dark-700/50 bg-dark-800/30 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Grid: 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-8 text-center md:divide-x divide-dark-700/30">
            {[
              { label: "Data Processed / Day", value: 50, suffix: "TB+" },
              {
                label: "Prediction Accuracy",
                value: 87,
                suffix: "%",
                decimals: 1,
              },
              { label: "Assets Protected", value: 1200, suffix: "+" },
              { label: "Downtime Prevented", value: 5000, suffix: "  Hrs" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="px-2 md:px-4"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 md:mb-2 flex justify-center font-mono">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    separator=","
                  />
                  <span className="text-accent-cyan ml-1">{stat.suffix}</span>
                </div>
                <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION CARDS --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              {
                title: "Our Mission",
                desc: "To democratize industrial AI. We believe advanced predictive maintenance shouldn't just be for tech giants, but accessible to every facility manager.",
                icon: Target,
                color: "text-accent-cyan",
                bg: "bg-accent-cyan",
                border: "hover:border-accent-cyan/60",
                shadow: "hover:shadow-accent-cyan/10",
              },
              {
                title: "The Core Engine",
                desc: "Our proprietary Hybrid Neural Networks process high-frequency vibration data at the edge, detecting anomalies milliseconds after they occur.",
                icon: Zap,
                color: "text-purple-400",
                bg: "bg-purple-400",
                border: "hover:border-purple-400/60",
                shadow: "hover:shadow-purple-400/10",
              },
              {
                title: "Global Scale",
                desc: "Built on a secure, distributed cloud architecture. Proteus scales effortlessly from a single pilot machine to thousands of assets across continents.",
                icon: Globe,
                color: "text-blue-500",
                bg: "bg-blue-500",
                border: "hover:border-blue-500/60",
                shadow: "hover:shadow-blue-500/10",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`bg-dark-800/80 backdrop-blur p-6 md:p-8 rounded-2xl md:rounded-3xl border border-dark-700 transition-all duration-300 group shadow-xl ${card.border} ${card.shadow}`}
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 bg-dark-900 rounded-2xl flex items-center justify-center mb-6 group-hover:${card.bg} transition-all duration-300 shadow-inner border border-dark-700`}
                >
                  <card.icon
                    className={`${card.color} group-hover:text-black transition-colors`}
                    size={24}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-lg">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- THE STORY SECTION --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-dark-900 to-dark-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-dark-900 -skew-y-3 transform origin-top -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Born from Frustration, <br />
              Forgged in <span className="text-accent-cyan">Code.</span>
            </h2>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-base md:text-lg">
              We were tired of reactive maintenance. Waiting for a critical
              machine to fail before fixing it felt archaic in the age of AI.
              The costs—both financial and operational—were simply too high.
            </p>
            <p className="text-gray-300 mb-8 md:mb-10 leading-relaxed text-base md:text-lg">
              What started as a weekend project to monitor a single problematic
              pump has evolved into Proteus Guardian. We combined our obsession
              with robust backend systems and cutting-edge machine learning.
            </p>

            {/* Grid Checkpoints Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 md:gap-x-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                "End-to-End Encryption",
                "Sub-second Latency",
                "99.99% Uptime SLA",
                "Edge-First Design",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-white font-bold text-sm md:text-base"
                >
                  <CheckCircle
                    className="text-accent-cyan drop-shadow-glow flex-shrink-0"
                    size={18}
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Abstract Visual */}
          <motion.div
            className="flex-1 w-full flex justify-center relative mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-accent-cyan/20 blur-3xl rounded-full animate-pulse-slow"></div>

            <div className="relative w-full max-w-sm md:max-w-lg aspect-square bg-dark-800/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-dark-600/50 p-6 md:p-10 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10">
                <Cpu
                  size={100}
                  className="text-accent-cyan md:w-[150px] md:h-[150px]"
                />
              </div>

              {/* Animated Data Bars */}
              <div className="space-y-4 md:space-y-6 z-10 mt-8 md:mt-12">
                {[
                  { c: "bg-accent-cyan", w: ["0%", "75%"], d: 0 },
                  { c: "bg-accent-purple", w: ["0%", "55%"], d: 0.2 },
                  { c: "bg-blue-500", w: ["0%", "90%"], d: 0.4 },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="h-2 md:h-3 w-full bg-dark-900/50 rounded-full overflow-hidden backdrop-blur"
                  >
                    <motion.div
                      className={`h-full ${bar.c}`}
                      animate={{ width: bar.w }}
                      transition={{
                        duration: 2 + i,
                        delay: bar.d,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-dark-900/90 backdrop-blur p-4 md:p-5 rounded-xl md:rounded-2xl border border-dark-600 flex items-center gap-4 z-10 mt-6 md:mt-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <ShieldCheck className="text-green-400 w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm md:text-lg">
                    System Status
                  </div>
                  <div className="text-green-400 text-xs md:text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-accent-cyan/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6"
          >
            Meet The Builders
          </motion.h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            A multidisciplinary team of 5 experts in machine learning, backend,
            and frontend engineering, united by a single mission.
          </p>
        </div>

        {/* SWIPER CAROUSEL */}
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            speed={800}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="pb-12 md:pb-16 !overflow-visible"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="group relative overflow-hidden rounded-3xl md:rounded-[2.5rem] h-[400px] md:h-[450px] border border-dark-700/50 shadow-2xl shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-accent-cyan/20">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>

                  {/* Card Content Responsive */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-6 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-dark-900 to-transparent">
                    <div className="w-10 md:w-12 h-1 bg-accent-cyan mb-3 md:mb-4 rounded-full"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                      {member.name}
                    </h3>
                    <p className="text-accent-cyan font-bold text-xs md:text-sm uppercase tracking-wider mb-4 md:mb-6">
                      {member.role}
                    </p>

                    <div className="flex gap-4 md:gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-2 md:p-3 rounded-full hover:bg-accent-cyan hover:text-black transition-all border border-dark-600"
                        >
                          <Linkedin size={18} className="md:w-5 md:h-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-2 md:p-3 rounded-full hover:bg-accent-purple hover:text-white transition-all border border-dark-600"
                        >
                          <Github size={18} className="md:w-5 md:h-5" />
                        </a>
                      )}
                      {member.ig && (
                        <a
                          href={member.ig}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-2 md:p-3 rounded-full hover:bg-pink-600 hover:text-white transition-all border border-dark-600"
                        >
                          <Instagram size={18} className="md:w-5 md:h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent-cyan/30 blur-[100px] md:blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-dark-800/50 backdrop-blur-xl border-2 border-accent-cyan/20 rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-accent-cyan/10"
        >
          <Zap className="absolute top-4 left-4 md:top-10 md:left-10 text-accent-cyan/20 rotate-12 w-12 h-12 md:w-20 md:h-20" />
          <Target className="absolute bottom-4 right-4 md:bottom-10 md:right-10 text-blue-500/20 -rotate-12 w-12 h-12 md:w-20 md:h-20" />

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-8 relative z-10 leading-tight">
            Ready to predict the{" "}
            <span className="text-accent-cyan">unpredictable?</span>
          </h2>
          <p className="text-gray-200 text-base md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto relative z-10 font-light px-2">
            Don't wait for the next breakdown. Join the Industry 4.0 revolution
            and secure your assets with Proteus Guardian today.
          </p>

          <motion.button
            onClick={handleStartPilot}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(6,182,212,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 md:px-12 md:py-5 bg-accent-cyan text-black font-black text-base md:text-lg rounded-full hover:bg-cyan-300 transition-all shadow-lg shadow-accent-cyan/30 flex items-center gap-2 md:gap-3 mx-auto relative z-10 group cursor-pointer"
          >
            Start Free Pilot{" "}
            <ArrowRight
              size={20}
              className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
