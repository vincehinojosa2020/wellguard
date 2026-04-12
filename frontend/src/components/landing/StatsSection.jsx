import React from 'react';
import { motion } from 'framer-motion';
import { statsData } from '../../data/mockData';

const StatsSection = () => (
  <section className="py-20 bg-[#1B1F3B]">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {statsData.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: statsData.indexOf(stat) * 0.1 }}
            className="text-center"
          >
            <p className="text-4xl lg:text-5xl font-bold text-[#C8FF00] mb-2">{stat.value}</p>
            <p className="text-gray-400 text-[14px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
