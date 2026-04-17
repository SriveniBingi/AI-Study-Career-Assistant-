import React, { useState, useEffect } from 'react';
import { FileSearch, Upload, Loader2, BarChart3, AlertCircle, User, Briefcase, Clock, FileText, Sparkles, RotateCcw, Target, Globe, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ResumeAnalyzer({ roadmapData }) {
  const [mode, setMode] = useState("general"); // modes: "general", "roadmap", "jd"
  const [formData, setFormData] = useState({
    candidateName: "",
    targetJob: "",
    yearsExperience: "",
    jobDescription: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const hasRoadmap = roadmapData && roadmapData.length > 0;
  
  useEffect(() => {
    if (hasRoadmap) {
      setMode("roadmap");
      setAnalysis(null); 
    }
  }, [roadmapData, hasRoadmap]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 NEW: Clean Reset Function
  const handleReset = () => {
    setAnalysis(null);
    setFile(null);
    setFormData({
      candidateName: "",
      targetJob: "",
      yearsExperience: "",
      jobDescription: ""
    });
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload your Resume PDF first.");
    
    setLoading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const textRes = await axios.post('http://localhost:5000/api/upload-pdf', data);
      
      const res = await axios.post('http://localhost:5000/api/analyze-resume', {
        ...formData,
        resumeText: textRes.data.text,
        roadmapData: mode === "roadmap" ? roadmapData : null,
        jobDescription: mode === "jd" ? formData.jobDescription : null
      });

      setAnalysis(res.data.data);
    } catch (err) {
      alert("Analysis failed. Ensure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-2xl shadow-blue-100 relative overflow-hidden transition-all">
      
      {/* 🟢 NEW: Dynamic Background Glow based on Mode */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl transition-colors duration-500 ${
        mode === 'jd' ? 'bg-purple-500' : mode === 'roadmap' ? 'bg-emerald-500' : 'bg-blue-500'
      }`} />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl shadow-lg text-white transition-colors duration-500 ${
            mode === 'jd' ? 'bg-purple-600 shadow-purple-200' : mode === 'roadmap' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'
          }`}>
            <FileSearch size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">AI Resume Intelligence</h2>
            {/* 🟢 NEW: Interactive Mode Badge */}
            <div className="flex items-center gap-2 mt-1">
                <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border ${
                    mode === 'jd' ? 'bg-purple-50 border-purple-200 text-purple-600' : 
                    mode === 'roadmap' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                    'bg-blue-50 border-blue-200 text-blue-600'
                }`}>
                    {mode === 'jd' ? <Target size={10}/> : mode === 'roadmap' ? <Map size={10}/> : <Globe size={10}/>}
                    {mode} Mode Active
                </span>
            </div>
          </div>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-inner">
          {['general', 'roadmap', 'jd'].map((m) => (
            <button 
              key={m}
              onClick={() => {
                  if (m === 'roadmap' && !hasRoadmap) return alert("Generate a roadmap first!");
                  setMode(m);
                  setAnalysis(null);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all capitalize ${
                  mode === m 
                  ? 'bg-white shadow-md text-blue-600 scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              } ${m === 'roadmap' && !hasRoadmap ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {m === 'jd' ? 'Match ID' : m}
            </button>
          ))}
        </div>
      </div>

      {!analysis ? (
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          
          <AnimatePresence mode="wait">
            {mode === "jd" ? (
              <motion.div 
                key="jd-form"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Candidate Name</label>
                    <input name="candidateName" value={formData.candidateName} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-purple-400 outline-none transition-all text-sm font-bold" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Role</label>
                    <input name="targetJob" value={formData.targetJob} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-purple-400 outline-none transition-all text-sm font-bold" placeholder="e.g. Java Developer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Detailed Job Description</label>
                  <textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} className="w-full p-4 h-32 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-purple-400 outline-none transition-all text-sm resize-none font-medium" placeholder="Paste the job requirements here to see how you match..." />
                </div>
              </motion.div>
            ) : (
                <motion.div 
                    key="simple-view"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200"
                >
                    <Sparkles className={`mx-auto mb-3 ${mode === 'roadmap' ? 'text-emerald-500' : 'text-blue-500'}`} size={32} />
                    <h3 className="text-lg font-black text-slate-800">
                        {mode === "roadmap" ? "AI Roadmap Comparison" : "Industry Standard Analysis"}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto px-4">
                        {mode === "roadmap" 
                       ? "Validating your resume against the technical skills in your generated learning path." 
                        : "Measuring your profile against global technology hiring standards and professional requirements."}
                    </p>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Common Upload Box */}
          <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center transition-all group ${
              file ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
          }`}>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
            <Upload className={`mb-4 transition-transform group-hover:scale-110 ${file ? 'text-emerald-500' : 'text-slate-400'}`} size={48} />
            <p className="text-slate-700 font-black">{file ? file.name : "Drop your Resume PDF here"}</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Maximum File Size: 10MB</p>
          </div>

          <button 
            onClick={handleAnalyze} disabled={loading}
            className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-white ${
                mode === 'jd' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100' : 
                mode === 'roadmap' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 
                'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "AI is Scanning Resume..." : "Run AI Analysis"}
          </button>
        </div>
      ) : (
        <ResultsDisplay analysis={analysis} onReset={handleReset} />
      )}
    </div>
  );
}

// Sub-component for results
function ResultsDisplay({ analysis, onReset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[3.5rem] flex flex-col items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="text-7xl font-black text-white mb-2 drop-shadow-lg">{analysis.score}%</div>
        <div className="text-blue-100 font-black uppercase tracking-[0.3em] text-[10px]">Candidate Match Score</div>
        <div className="mt-8 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-black text-sm tracking-wider border border-white/30 italic">
            {analysis.verdict}
        </div>
      </div>
      
      <div className="space-y-6 flex flex-col justify-center">
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
          <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
            <BarChart3 size={18} className="text-blue-600"/> Expert Feedback
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed font-medium italic">"{analysis.feedback}"</p>
        </div>
        
        <div>
          <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
            <AlertCircle size={18} className="text-amber-500"/> Critical Gaps
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((s, i) => (
              <span key={i} className="bg-white border-2 border-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-700 shadow-sm hover:border-blue-400 transition-colors">
                + {s}
              </span>
            ))}
          </div>
        </div>

        <button 
            onClick={onReset} 
            className="flex items-center justify-center gap-2 w-full mt-4 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
        >
          <RotateCcw size={14} /> Analyze Another Resume
        </button>
      </div>
    </motion.div>
  );
}