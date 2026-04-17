import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, LayoutDashboard, Sparkles, FileText,
  Compass, LogOut, History, GraduationCap, X, User 
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
  };

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');
        /* 🟢 THIS MAKES YOUR BOXES VISIBLE */
        .workspace-container-box {
            border: 3px solid #94A3B8 !important; /* Thick Slate-400 border */
            background-color: #FFFFFF;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* 🟢 THIS MAKES THE INNER INPUT BOXES (LIKE SUMMARIZER) VISIBLE */
        textarea, .drop-zone, .input-field {
            border: 2px solid #64748B !important; /* Solid Darker Slate */
            background-color: #F8FAFC !important; /* Light contrast background */
        }      
      `}</style>

      {/* ── 1. SIDEBAR ── */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm z-50">
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
                onClick={() => setActiveTab(tab.id)}
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

        {/* Bottom Actions */}
        <div className="mt-auto space-y-1">
          <button 
            onClick={() => setActiveTab('history')} 
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

      {/* ── 2. MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 🔝 HEADER: Split Greeting (Left) and Profile (Right) */}
        <header className="h-20 px-10 flex items-center justify-between border-b border-slate-50 bg-white/80 backdrop-blur-md z-10">
          
          {/* Greeting on the Left */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              Hello {user.name}, Welcome Back
            </h3>
            <p className="text-[11px] text-blue-600 font-black uppercase tracking-widest">Workspace</p>
          </div>
          
          {/* Profile Card on the Far Right */}
          <div className="flex items-center gap-4 bg-white p-1.5 pr-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800 leading-tight">{user.name}</span>
              <span className="text-[11px] text-slate-400 font-medium">{user.email}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600">
               <User size={20} />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'history' ? (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 relative shadow-sm">
                    <button 
                      onClick={() => setActiveTab('summarizer')}
                      className="absolute top-8 right-8 p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 font-sora">Recent Activity</h2>
                      <p className="text-slate-400 text-sm font-medium mt-1">Access your saved study materials.</p>
                    </div>

                    <div className="border-t border-slate-50 pt-8">
                      {user.id && <HistorySidebar userId={user.id} onSelectSession={handleSelectHistory} refreshKey={historyVersion} />}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ background: activeTabData.bg }} className="rounded-[2.5rem] p-10 mb-8 flex items-center justify-between border border-white">
                      <div>
                        <h1 className="text-3xl font-black text-slate-900 font-sora mb-2">{activeTabData.emoji} {activeTabData.label}</h1>
                        <p className="text-slate-600 font-medium">{activeTabData.desc}</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <activeTabData.icon size={28} color={activeTabData.accent} />
                      </div>
                    </div>
                    <div className="workspace-container-box p-10 rounded-[2.5rem] min-h-[500px]">
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