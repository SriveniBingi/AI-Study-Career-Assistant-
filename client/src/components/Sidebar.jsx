import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, PenTool, MessageCircle, Calendar, Settings } from 'lucide-react';

const MenuItem = ({ icon: Icon, text, active }) => (
  <motion.div
    whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    className={`flex items-center space-x-4 p-4 cursor-pointer rounded-2xl transition-all ${
      active ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'
    }`}
  >
    <Icon size={22} />
    <span className="font-semibold">{text}</span>
  </motion.div>
);

export default function Sidebar() {
  return (
    <div className="w-72 h-screen bg-[#F1F5F9]/50 backdrop-blur-lg p-6 flex flex-col border-r border-slate-200">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-12 px-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg rotate-3" />
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Study.AI
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <MenuItem icon={LayoutDashboard} text="Dashboard" active />
        <MenuItem icon={BookOpen} text="Summarizer" />
        <MenuItem icon={PenTool} text="Quiz Hub" />
        <MenuItem icon={Calendar} text="Planner" />
        <MenuItem icon={MessageCircle} text="Doubt Solver" />
      </nav>

      {/* Bottom Profile/Settings */}
      <div className="pt-6 border-t border-slate-200">
        <MenuItem icon={Settings} text="Settings" />
      </div>
    </div>
  );
}