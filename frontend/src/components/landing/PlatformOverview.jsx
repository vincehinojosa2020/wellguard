import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { inputSources, outputBenefits, platformFeatures } from '../../data/mockData';

const iconMap = { ShieldAlert, GitBranch, ScanSearch, Eye, PackageCheck, FileCheck2 };

const PlatformOverview = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-8 items-center">
        <div className="space-y-4">
          {inputSources.map((source) => (
            <motion.div
              key={source}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: inputSources.indexOf(source) * 0.1 }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-[15px] font-medium text-gray-700">{source}</span>
              <ArrowRight className="w-4 h-4 text-[#1B1F3B] ml-auto" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1B1F3B] rounded-2xl p-8 text-center relative"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
            Type-A One
          </h2>
          <p className="text-gray-300 text-sm mb-8">AI-Native DevSecOps Platform</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {platformFeatures.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <div key={feature.id} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors cursor-pointer">
                  {Icon && <Icon className="w-6 h-6 text-[#C8FF00] mx-auto mb-2" />}
                  <p className="text-white text-xs font-medium">{feature.title}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Powered by</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>Unmatched Open Source Intelligence</p>
            <p className="text-gray-400 text-xs mt-2">Built on Trivy & OSS Index</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {outputBenefits.map((benefit) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: outputBenefits.indexOf(benefit) * 0.1 }}
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
);

export default PlatformOverview;
