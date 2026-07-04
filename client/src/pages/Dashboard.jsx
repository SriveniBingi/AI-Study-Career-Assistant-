import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, LayoutDashboard, Sparkles, FileText,
  Compass, LogOut, History, GraduationCap, X, User, Menu 
} from 'lucide-react';

// Components
import Summarizer from '../components/Summarizer';
import QuizHub from '../components/QuizHub';
import DoubtSolver from '../components/DoubtSolver';
import HistorySidebar from '../components/HistorySidebar';
import CareerRoadmap from '../components/CareerRoadmap';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const TABS = [
  { id: 'summarizer', label: 'Summarizer', icon: FileText, accent: '#2563EB', bg: 'linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)', desc: 'Condense any topic into sharp, clear notes.', emoji: '📝' },
  { id: 'quiz', label: 'Quiz Hub', icon: Sparkles, accent: '#7C3AED', bg: 'linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 100%)', desc: 'Test yourself with AI-generated quizzes.', emoji: '✨' },
  { id: 'doubt', label: 'Doubt Solver', icon: MessageSquare, accent: '#059669', bg: 'linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 100%)', desc: 'Ask anything — get instant clarity.', emoji: '💬' },
  { id: 'roadmap', label: 'Career Roadmap', icon: Compass, accent: '#0F172A', bg: 'linear-gradient(135deg,#F8FAFC 0%,#E2E8F0 100%)', desc: 'Map your professional future step by step.', emoji: '🧭' },
  { id: 'resume', label: 'Resume Analysis', icon: FileText, accent: '#DC2626', bg: 'linear-gradient(135deg,#FFF7F7 0%,#FEE2E2 100%)', desc: 'Spot gaps and sharpen your resume.', emoji: '📄' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('summarizer');
  const [sharedText, setSharedText] = useState('');
  const [currentRoadmap, setCurrentRoadmap] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [user, setUser] = useState({ name: 'Sita', id: '', email: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!token) navigate('/');
    else if (storedUser) {
      setUser({ 
        name: storedUser.name || 'Sita', 
        id: storedUser.id, 
        email: storedUser.email || 'student@university.edu'
      });
    }
  }, [navigate]);

  const handleSelectHistory = (session) => {
    setSelectedSession(session);
    setSharedText(session.originalText);
    setActiveTab('summarizer');
    setIsMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');
        .workspace-container-box {
            border: 3px solid #94A3B8 !important;
            background-color: #FFFFFF;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        textarea, .drop-zone, .input-field {
            border: 2px solid #64748B !important;
            background-color: #F8FAFC !important;
        }      
      `}</style>

      {/* ── 1. SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col p-6 shadow-xl md:shadow-sm z-50 transition-transform duration-300 md:static md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sora">Study.AI</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1">
          <button 
            onClick={() => handleTabClick('history')} 
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'history' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <History size={18} /> View History
          </button>
          
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:text-red-500 font-bold text-sm transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Dark Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* ── 2. MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative">
        
        {/* 🔝 HEADER: Clean solid colors to avoid backdrop overlay bugs on older phone engines */}
        <header className="h-20 px-4 md:px-10 flex items-center justify-between border-b border-slate-100 bg-white z-20 w-full shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 md:hidden hover:bg-slate-100 transition-all shrink-0"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight truncate">
                Hello {user.name}
              </h3>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Workspace</p>
            </div>
          </div>
          
          {/* Profile Card Far Right */}
          <div className="flex items-center gap-4 bg-white p-1.5 md:pr-5 rounded-2xl border border-slate-50 shadow-xs shrink-0">
            <div className="flex flex-col text-right hidden sm:flex min-w-0">
              <span className="text-sm font-bold text-slate-800 leading-tight truncate">{user.name}</span>
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">{user.email}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 shrink-0">
               <User size={20} />
            </div>
          </div>
        </header>

        {/* Content Container Area */}
        <main className="flex-1 p-4 md:p-10 w-full z-10">
          <div className="max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeTab === 'history' ? (
                  <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 relative shadow-sm w-full">
                    <button 
                      onClick={() => setActiveTab('summarizer')}
                      className="absolute top-6 right-6 md:top-8 md:right-8 p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 font-sora">Recent Activity</h2>
                      <p className="text-slate-400 text-sm font-medium mt-1">Access your saved study materials.</p>
                    </div>

                    <div className="border-t border-slate-50 pt-8 w-full">
                      {user.id && <HistorySidebar userId={user.id} onSelectSession={handleSelectHistory} refreshKey={historyVersion} />}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white gap-4 w-full shadow-xs" style={{ background: activeTabData.bg }}>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-sora mb-2">{activeTabData.emoji} {activeTabData.label}</h1>
                        <p className="text-slate-600 font-medium text-sm md:text-base">{activeTabData.desc}</p>
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0 self-end sm:self-center">
                        <activeTabData.icon size={24} color={activeTabData.accent} />
                      </div>
                    </div>
                    <div className="workspace-container-box p-4 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] min-h-[400px] md:min-h-[500px] w-full bg-white">
                      {activeTab === 'summarizer' && <Summarizer onTextChange={setSharedText} initialData={selectedSession} onSaveSuccess={() => setHistoryVersion(v => v + 1)} />}
                      {activeTab === 'quiz' && <QuizHub text={sharedText} />}
                      {activeTab === 'doubt' && <DoubtSolver context={sharedText} />}
                      {activeTab === 'roadmap' && <CareerRoadmap text={sharedText} setRoadmapData={setCurrentRoadmap} />}
                      {activeTab === 'resume' && <ResumeAnalyzer roadmapData={currentRoadmap} />}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
