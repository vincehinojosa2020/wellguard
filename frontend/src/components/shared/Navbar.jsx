import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/mockData';
import { ChevronDown, Search, Hexagon, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Hexagon className="w-9 h-9 text-[#1B1F3B] fill-[#1B1F3B] transition-transform group-hover:scale-110" strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">A</span>
          </div>
          <span className="text-[22px] font-bold text-[#1B1F3B] tracking-tight">
            Type-A
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, idx) => (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(idx)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.children ? (
                <button className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-[#1B1F3B] transition-colors rounded-lg hover:bg-gray-50">
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to={link.href || '#'}
                  className="px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-[#1B1F3B] transition-colors rounded-lg hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              )}

              {/* Dropdown */}
              {link.children && openDropdown === idx && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {link.children.map((child, childIdx) => (
                    <Link
                      key={childIdx}
                      to={child.href}
                      className="block px-4 py-2.5 text-[14px] text-gray-600 hover:text-[#1B1F3B] hover:bg-gray-50 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <Link
            to="/dashboard"
            className="text-[15px] font-medium text-gray-700 hover:text-[#1B1F3B] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isDashboard ? 'Dashboard' : 'Login'}
          </Link>
          <Link to="#" className="text-[15px] font-medium text-gray-700 hover:text-[#1B1F3B] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Contact Us
          </Link>
          <Link to="/dashboard">
            <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg">
              Book a Demo
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-6 shadow-lg">
          {navLinks.map((link, idx) => (
            <div key={idx} className="py-2">
              {link.children ? (
                <div>
                  <button
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-700 py-2"
                    onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === idx && (
                    <div className="pl-4 space-y-1">
                      {link.children.map((child, childIdx) => (
                        <Link
                          key={childIdx}
                          to={child.href}
                          className="block py-2 text-[14px] text-gray-500 hover:text-[#1B1F3B]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link.href || '#'}
                  className="block py-2 text-[15px] font-medium text-gray-700 hover:text-[#1B1F3B]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-2 space-y-3">
            <Link to="/dashboard" className="block text-center">
              <Button className="w-full bg-[#E8553A] hover:bg-[#d44a32] text-white">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
