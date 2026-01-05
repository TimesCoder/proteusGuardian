import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup"; // Import CountUp
import {useAuth} from '../context/AuthContext';
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// --- DATA TIM (5 ORANG) ---
const teamMembers = [
  {
    name: "Mohammad Ari Alexander Aziz",
    role: "Project Manager",
    img: "https://media.licdn.com/dms/image/v2/D5603AQG7z02qZ5bH4g/profile-displayphoto-shrink_400_400/B56ZfGWIJQGQAo-/0/1751379379690?e=1767830400&v=beta&t=F0rSJpYNcAE6AhgpBNqz_137jKNIUIm9ra5MdDilA1o",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/ariaziz/",
    github: "https://github.com/13222093",
  },
  {
    name: "Joshua Bulyan Zebua",
    role: "Lead Backend Engineer",
    img: "https://media.licdn.com/dms/image/v2/D5635AQHHN_ooluzMVg/profile-framedphoto-shrink_400_400/B56ZTvnAlHHQAg-/0/1739186768621?e=1766685600&v=beta&t=RHF7AgGxbdioJkSsvHIc-N8JJZejrnYFTUo-ELf5S9o",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/joshuabulyanzebua/",
    github: "https://github.com/TimesCoder",
  },
  {
    name: "Rizkillah Ramanda Sinyo",
    role: "Lead Machine Learning Engineer",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFrVb9mOF9rPw/profile-displayphoto-scale_400_400/B4DZgB_Zr5GkAg-/0/1752380055043?e=1767830400&v=beta&t=EIBXXed7yvdCY-1NpBhl26ahSYpB9FEKrcLaCYtvHP4",
    ig: "https://www.instagram.com/rizkillahramandaa/",
    linkedin: "https://www.linkedin.com/in/rizkillah-ramanda-sinyo/",
    github: "https://github.com/Diki04",
  },
  {
    name: "Amanda Grace Patricia Sinurat",
    role: "Frontend Engineer",
    img: "https://media.licdn.com/dms/image/v2/D5635AQHFbUHJN0HHuQ/profile-framedphoto-shrink_400_400/B56ZqBIuMGJYAc-/0/1763103139033?e=1766685600&v=beta&t=qAKt9T9wuDEwsTTypwtsDKngjtMNqsdrijTHd_LfPpU",
    ig: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/in/amanda-grace-342530255/",
    github: "https://github.com/",
  },
  {
    name: "Lusiana Novika Togatorop",
    role: "Backend Engineer",
    img: "https://media.licdn.com/dms/image/v2/D5603AQGRNxcycuxHvQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1699813146339?e=1767830400&v=beta&t=Ck3FIkNAf06NqJTrthfeWVYS74BTrcs315-fkNqfLIk",
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

// Custom CSS untuk Pagination Swiper agar warnanya Cyan
const swiperStyleCSS = `
  .swiper-pagination-bullet { background-color: #4b5563; opacity: 1; }
  .swiper-pagination-bullet-active { background-color: #06b6d4; width: 24px; border-radius: 8px; transition: all 0.3s; }
`;

const AboutUs = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleStartPilot = async () => {
    if (currentUser) {
      // Jika sudah login, langsung ke dashboard
      navigate('/dashboard');
    } else {
      // Jika belum, buka popup login Google
      try {
        await loginWithGoogle();
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans overflow-x-hidden selection:bg-accent-cyan selection:text-black">
      {/* Inject Custom CSS untuk Swiper */}
      <style>{swiperStyleCSS}</style>

      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        {/* Tombol Back */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group bg-dark-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-accent-cyan/50"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform text-accent-cyan"
          />
          <span className="text-sm font-bold tracking-wide">Back to Home</span>
        </Link>

        {/* Logo Kecil di Kanan (Opsional, biar seimbang) */}
        <div className="hidden md:block text-lg font-bold italic text-white/80">
          Proteus <span className="text-accent-cyan">Guardian</span>
        </div>
      </nav>

      {/* --- HERO SECTION (Lebih Dinamis) --- */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Background Glow yang Berputar */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent-cyan/20 to-blue-600/20 blur-[150px] rounded-full -z-10 opacity-70 origin-center"
        ></motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-accent-cyan uppercase bg-dark-800/80 backdrop-blur rounded-full border border-accent-cyan/30 shadow-lg shadow-accent-cyan/10"
            >
              <Users size={14} /> Who We Are
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight"
            >
              We Secure The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-purple-500 animate-gradient-x">
                Industrial Future.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
            >
              Proteus Guardian bridges the gap between raw sensor data and
              actionable AI intelligence. We predict failures before they
              happen, so your world never stops running.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION (Dengan CountUp Animasi) --- */}
      <section className="py-12 border-y border-dark-700/50 bg-dark-800/30 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-dark-700/30">
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
                className="px-4"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2 flex justify-center font-mono">
                  {/* Integrasi React CountUp */}
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    separator=","
                  />
                  <span className="text-accent-cyan">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION & TECHNOLOGY CARDS (Lebih Interaktif) --- */}
      <section className="py-24 px-6 relative">
        {/* Decorative Lines */}
        <div className="absolute inset-0 flex justify-center items-center -z-10 opacity-10 pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent"></div>
          <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-accent-cyan to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-dark-800/80 backdrop-blur p-8 rounded-3xl border border-dark-700 hover:border-accent-cyan/60 transition-all duration-300 group shadow-xl hover:shadow-accent-cyan/10"
            >
              <div className="w-14 h-14 bg-dark-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-cyan transition-all duration-300 shadow-inner border border-dark-700 group-hover:border-accent-cyan">
                <Target
                  className="text-accent-cyan group-hover:text-black transition-colors"
                  size={28}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                To democratize industrial AI. We believe advanced predictive
                maintenance shouldn't just be for tech giants, but accessible to
                every facility manager.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-dark-800/80 backdrop-blur p-8 rounded-3xl border border-dark-700 hover:border-accent-purple/60 transition-all duration-300 group shadow-xl hover:shadow-accent-purple/10"
            >
              <div className="w-14 h-14 bg-dark-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-purple transition-all duration-300 shadow-inner border border-dark-700 group-hover:border-accent-purple">
                <Zap
                  className="text-accent-purple group-hover:text-white transition-colors"
                  size={28}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                The Core Engine
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Our proprietary Hybrid Neural Networks process high-frequency
                vibration data at the edge, detecting anomalies milliseconds
                after they occur.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-dark-800/80 backdrop-blur p-8 rounded-3xl border border-dark-700 hover:border-blue-500/60 transition-all duration-300 group shadow-xl hover:shadow-blue-500/10"
            >
              <div className="w-14 h-14 bg-dark-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-all duration-300 shadow-inner border border-dark-700 group-hover:border-blue-500">
                <Globe
                  className="text-blue-500 group-hover:text-white transition-colors"
                  size={28}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Global Scale
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Built on a secure, distributed cloud architecture. Proteus
                scales effortlessly from a single pilot machine to thousands of
                assets across continents.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- THE STORY SECTION --- */}
      <section className="py-24 px-6 bg-gradient-to-b from-dark-900 to-dark-800 relative overflow-hidden">
        {/* Diagonal Stripe */}
        <div className="absolute top-0 left-0 w-full h-full bg-dark-900 -skew-y-3 transform origin-top -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              Born from Frustration, <br />
              Forged in <span className="text-accent-cyan">Code.</span>
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              We were tired of reactive maintenance. Waiting for a critical
              machine to fail before fixing it felt archaic in the age of AI.
              The costs—both financial and operational—were simply too high.
            </p>
            <p className="text-gray-300 mb-10 leading-relaxed text-lg">
              What started as a weekend project to monitor a single problematic
              pump has evolved into Proteus Guardian. We combined our obsession
              with robust backend systems and cutting-edge machine learning to
              create a shield for your infrastructure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "End-to-End Encryption",
                "Sub-second Latency",
                "99.99% Uptime SLA",
                "Edge-First Design",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-white font-bold"
                >
                  <CheckCircle
                    className="text-accent-cyan drop-shadow-glow"
                    size={22}
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Abstract Visual */}
          <motion.div
            className="flex-1 w-full lg:w-auto flex justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 bg-accent-cyan/20 blur-3xl rounded-full animate-pulse-slow"></div>

            <div className="relative w-full max-w-lg aspect-square bg-dark-800/80 backdrop-blur-xl rounded-[3rem] border border-dark-600/50 p-10 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cpu size={150} className="text-accent-cyan" />
              </div>

              {/* Animated Data Bars */}
              <div className="space-y-6 z-10 mt-12">
                {[
                  { c: "bg-accent-cyan", w: ["0%", "75%"], d: 0 },
                  { c: "bg-accent-purple", w: ["0%", "55%"], d: 0.2 },
                  { c: "bg-blue-500", w: ["0%", "90%"], d: 0.4 },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="h-3 w-full bg-dark-900/50 rounded-full overflow-hidden backdrop-blur"
                  >
                    <motion.div
                      className={`h-full ${bar.c} shadow-lg shadow-${
                        bar.c.split("-")[1]
                      }/50`}
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

              <div className="bg-dark-900/90 backdrop-blur p-5 rounded-2xl border border-dark-600 flex items-center gap-5 z-10 mt-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <ShieldCheck className="text-green-400" size={28} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    System Status
                  </div>
                  <div className="text-green-400 text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    All Systems Operational
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM SECTION (SWIPER CAROUSEL UNTUK 5 ORANG) --- */}
      <section className="py-28 px-6 relative z-10">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-accent-cyan/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Meet The Builders
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            A multidisciplinary team of 5 experts in machine learning,
            backend engineer, and frontend engineer, united by a single
            mission.
          </p>
        </div>

        {/* SWIPER CAROUSEL */}
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            speed={800} 
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 }, // Tablet: 2 slides
              1024: { slidesPerView: 3 }, // Desktop: 3 slides
            }}
            className="pb-16 !overflow-visible" // Padding bawah untuk pagination
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="group relative overflow-hidden rounded-[2.5rem] h-[450px] border border-dark-700/50 shadow-2xl shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-accent-cyan/20">
                  {/* Image with grayscale effect */}
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>

                  {/* Content Card - Slide up on hover */}
                  <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-dark-900 to-transparent">
                    <div className="w-12 h-1 bg-accent-cyan mb-4 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-accent-cyan font-bold text-sm uppercase tracking-wider mb-6">
                      {member.role}
                    </p>

                    {/* Social Icons - Fade in */}
                    <div className="flex gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                      {/* Icon LinkedIn */}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-3 rounded-full hover:bg-accent-cyan hover:text-black transition-all duration-300 border border-dark-600 hover:border-accent-cyan"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}

                      {/* Icon GitHub */}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-3 rounded-full hover:bg-accent-purple hover:text-white transition-all duration-300 border border-dark-600 hover:border-accent-purple"
                        >
                          <Github size={20} />
                        </a>
                      )}

                      {/* Icon Instagram */}
                      {member.ig && (
                        <a
                          href={member.ig}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-800/80 p-3 rounded-full hover:bg-accent-purple hover:text-white transition-all duration-300 border border-dark-600 hover:border-accent-purple"
                        >
                          <Instagram size={20} />
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
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Background Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/30 blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-dark-800/50 backdrop-blur-xl border-2 border-accent-cyan/20 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-accent-cyan/10"
        >
            {/* Corner Accents */}
            <Zap className="absolute top-10 left-10 text-accent-cyan/20 rotate-12" size={80}/>
            <Target className="absolute bottom-10 right-10 text-blue-500/20 -rotate-12" size={80}/>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">
                Ready to predict the <span className="text-accent-cyan">unpredictable?</span>
            </h2>
            <p className="text-gray-200 text-xl mb-12 max-w-3xl mx-auto relative z-10 font-light">
                Don't wait for the next breakdown. Join the Industry 4.0 revolution and secure your assets with Proteus Guardian today.
            </p>
            
            <motion.button 
                onClick={handleStartPilot} // <--- TAMBAHKAN INI
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-accent-cyan text-black font-black text-lg rounded-full hover:bg-cyan-300 transition-all shadow-lg shadow-accent-cyan/30 flex items-center gap-3 mx-auto relative z-10 group cursor-pointer"
            >
                Start Free Pilot <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform"/>
            </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
