import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2
} from 'lucide-react';
import { platformFeatures } from '../../data/mockData';

const iconMap = { ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2 };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const FeaturesSection = () => (
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
        <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Everything Your Team Needs to Ship Securely
        </motion.h2>
        <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">
          From vulnerability detection to license compliance, Type-A gives you complete visibility into every component your applications depend on.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformFeatures.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: platformFeatures.indexOf(feature) * 0.08 }}
              className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-[#1B1F3B]/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1B1F3B]/5 flex items-center justify-center mb-5 group-hover:bg-[#1B1F3B] transition-colors duration-300">
                {Icon && <Icon className="w-6 h-6 text-[#1B1F3B] group-hover:text-[#C8FF00] transition-colors duration-300" />}
              </div>
              <h3 className="text-lg font-bold text-[#1B1F3B] mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
