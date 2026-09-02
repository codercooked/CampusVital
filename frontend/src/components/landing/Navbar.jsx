import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 h-16 bg-[#000000]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] flex items-center px-6"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#FFFFFF] to-[#888888] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
           <span className="font-heading font-black text-[#000000] text-xl leading-none">C</span>
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-[#F0F4FF]">CampusVitals</span>
      </div>
      <div className="ml-10 hidden md:flex gap-6 font-medium text-sm text-[rgba(240,244,255,0.7)]">
        <a href="#" className="hover:text-[#FFFFFF] transition-colors">Platform</a>
        <a href="#genie-demo" className="hover:text-[#FFFFFF] transition-colors">Genie</a>
        <a href="#" className="hover:text-[#FFFFFF] transition-colors">Use Cases</a>
      </div>
      <div className="ml-auto">
        <Link to="/dashboard" className="bg-[#FFFFFF] text-[#000000] font-semibold text-sm px-6 py-2 rounded-lg hover:bg-[#FFFFFF]/90 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">
          Open Dashboard
        </Link>
      </div>
    </motion.nav>
  );
}
