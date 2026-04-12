import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Terminal } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#1B1F3B] via-[#2A2F5B] to-[#1B1F3B]">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#C8FF00] rounded-full filter blur-[120px]" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px]" />
    </div>
    <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-28 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#C8FF00] font-semibold text-sm tracking-wider uppercase mb-4">
            Introducing Type-A Platform
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-[56px] font-bold text-white leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Your Code Deserves Better Protection
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
            Stop guessing about your software supply chain. Type-A finds vulnerabilities before attackers do — powered by Trivy's open-source SCA engine, trusted by thousands of engineering teams.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white text-[15px] font-semibold px-8 h-[52px] rounded-lg transition-all hover:shadow-xl hover:shadow-red-500/20" data-testid="hero-start-scanning-btn">
                Start Scanning Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-gray-500 text-white hover:bg-white/10 text-[15px] font-semibold px-8 h-[52px] rounded-lg" data-testid="hero-how-it-works-btn">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="bg-[#0D1117] rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-gray-400 text-xs ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Terminal
              </span>
            </div>
            <div className="p-5 font-mono text-sm space-y-3">
              <div>
                <span className="text-[#C8FF00]">$ </span>
                <span className="text-white">type-a scan --source nginx:latest</span>
              </div>
              <div className="text-gray-400">Scanning dependencies with Trivy engine...</div>
              <div className="text-gray-400">Found 234 components across 12 ecosystems</div>
              <div className="mt-2 bg-[#1C2128] rounded-lg p-3 border border-gray-700">
                <div className="text-white font-semibold mb-2">Security & Quality Report</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-gray-300">Critical: <span className="text-red-400 font-bold">5</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-gray-300">High: <span className="text-orange-400 font-bold">12</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-gray-300">Medium: <span className="text-yellow-400 font-bold">23</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-300">Low: <span className="text-blue-400 font-bold">45</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold text-xs px-1.5 py-0.5 bg-red-500/20 rounded">MALWARE</span>
                <span className="text-white text-xs">type-a-2025-007110</span>
              </div>
              <div className="text-gray-500 text-xs">NPM Security Holding Packages · Severity: Critical</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
