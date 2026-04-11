import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import {
  ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2,
  ArrowRight, CheckCircle2, Hexagon, ChevronRight, Terminal, Shield,
  Zap, Lock, BarChart3, Globe
} from 'lucide-react';
import {
  platformFeatures, statsData, inputSources, outputBenefits
} from '../data/mockData';

const iconMap = {
  ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              <motion.h1 variants={fadeUp} className="text-4xl lg:text-[56px] font-bold text-white leading-[1.1] mb-6">
                Real-Time Intelligence for AI Coding Assistants
              </motion.h1>
              <motion.p variants={fadeUp} className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
                Put guardrails in place for AI assistants to choose the best components and automate dependency maintenance. Powered by Trivy SCA scanning.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white text-[15px] font-semibold px-8 py-6 rounded-lg transition-all hover:shadow-xl hover:shadow-red-500/20">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-gray-500 text-white hover:bg-white/10 text-[15px] font-semibold px-8 py-6 rounded-lg">
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Terminal mockup */}
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
                    <span className="text-white">type-a scan --source ./project</span>
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

      {/* Platform Overview Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-8 items-center">
            {/* Left: Input Sources */}
            <div className="space-y-4">
              {inputSources.map((source, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Globe className="w-5 h-5 text-[#1B1F3B]" />
                  <span className="text-[15px] font-medium text-gray-700">{source}</span>
                  <ArrowRight className="w-4 h-4 text-[#1B1F3B] ml-auto" />
                </motion.div>
              ))}
            </div>

            {/* Center: Platform */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1B1F3B] rounded-2xl p-8 text-center relative"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2" style={{ fontStyle: 'italic' }}>
                Type-A One
              </h2>
              <p className="text-gray-300 text-sm mb-8">AI-Native DevSecOps Platform</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {platformFeatures.map((feature) => {
                  const Icon = iconMap[feature.icon];
                  return (
                    <div key={feature.id} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                      {Icon && <Icon className="w-6 h-6 text-[#C8FF00] mx-auto mb-2" />}
                      <p className="text-white text-xs font-medium">{feature.title}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Powered by</p>
                <p className="text-2xl font-bold text-white italic">Unmatched Open Source Intelligence</p>
                <p className="text-gray-400 text-xs mt-2">Built on Trivy & OSS Index</p>
              </div>
            </motion.div>

            {/* Right: Output Benefits */}
            <div className="space-y-4">
              {outputBenefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#1B1F3B] flex-shrink-0" />
                  <span className="text-[15px] font-medium text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-[#E8553A] font-semibold text-sm tracking-wider uppercase mb-3">
              Platform Capabilities
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-[#1B1F3B] mb-4">
              Everything You Need to Secure Your Supply Chain
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">
              From vulnerability detection to license compliance, Type-A provides comprehensive coverage for your software supply chain.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, idx) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#1B1F3B]/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1B1F3B]/5 flex items-center justify-center mb-4 group-hover:bg-[#1B1F3B] transition-colors duration-300">
                    {Icon && <Icon className="w-6 h-6 text-[#1B1F3B] group-hover:text-[#C8FF00] transition-colors duration-300" />}
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1F3B] mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#1B1F3B]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-[#C8FF00] mb-2">{stat.value}</p>
                <p className="text-gray-400 text-[14px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adam Carbajal CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8FF00]/10 rounded-full filter blur-[80px]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-[#E8553A] font-semibold text-sm tracking-wider uppercase mb-4">
                Why Type-A?
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1B1F3B] mb-4">
                "Type-A" — The Only Way to Describe Our Leadership
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Named after the relentless drive and vision of our executive leadership. Type-A represents excellence in software supply chain security — proactive, precise, and uncompromising.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white font-semibold px-8 py-6 rounded-lg transition-all hover:shadow-lg">
                    Start Scanning Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="#">
                  <Button variant="outline" className="border-gray-300 text-[#1B1F3B] font-semibold px-8 py-6 rounded-lg hover:bg-gray-50">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B1F3B] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative">
                  <Hexagon className="w-8 h-8 text-[#C8FF00] fill-[#C8FF00]" strokeWidth={1.5} />
                  <span className="absolute inset-0 flex items-center justify-center text-[#1B1F3B] font-bold text-xs">A</span>
                </div>
                <span className="text-xl font-bold">Type-A</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-4">
                AI-Native DevSecOps Platform. Securing the world's software supply chain with unmatched open source intelligence.
              </p>
              <p className="text-gray-500 text-xs">Powered by Trivy Open Source SCA Scanner</p>
            </div>
            {[
              { title: 'Platform', links: ['SCA', 'Dependency Mgmt', 'Malware Defense', 'SBOM', 'AI Governance'] },
              { title: 'Resources', links: ['Documentation', 'Blog', 'Case Studies', 'Webinars', 'API Reference'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Partners', 'Contact', 'Security'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link to="#" className="text-gray-400 text-sm hover:text-[#C8FF00] transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 Type-A. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link to="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
