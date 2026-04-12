import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8FF00]/10 rounded-full filter blur-[80px]" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-[#E8553A] font-semibold text-sm tracking-wider uppercase mb-4">
            Why Type-A?
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            "Type-A" — The Only Way to Describe Our Leadership
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Named after the relentless drive and vision of our executive leadership. Type-A represents excellence in software supply chain security — proactive, precise, and uncompromising. Your code is only as strong as the weakest dependency.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white font-semibold px-8 h-[52px] rounded-lg transition-all hover:shadow-lg" data-testid="cta-first-scan-btn">
                Run Your First Scan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="#">
              <Button variant="outline" className="border-gray-300 text-[#1B1F3B] font-semibold px-8 h-[52px] rounded-lg hover:bg-gray-50">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
