import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const footerColumns = [
  { title: 'Platform', links: ['SCA', 'Dependency Mgmt', 'Malware Defense', 'SBOM', 'AI Governance'] },
  { title: 'Resources', links: ['Documentation', 'Blog', 'Case Studies', 'Webinars', 'API Reference'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Partners', 'Contact', 'Security'] },
];

const FooterSection = () => (
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
            AI-Native DevSecOps Platform. Securing your software supply chain with unmatched open source intelligence.
          </p>
          <p className="text-gray-500 text-xs">Powered by Trivy Open Source SCA Scanner</p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
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
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;
