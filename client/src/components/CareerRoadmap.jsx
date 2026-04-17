import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Briefcase, Star, ChevronRight, Loader2, Compass, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function CareerRoadmap({ text, setRoadmapData }) {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Clear roadmap if user uploads new notes
  useEffect(() => {
    setRoadmap([]);
    setError("");
  }, [text]);

  const generateRoadmap = async () => {
  if (!text || text.length < 50) {
    alert("Please provide more detailed notes first!");
    return;
  }

  setLoading(true);
  setError("");
  try {
    const response = await axios.post('http://localhost:5000/api/career-roadmap', { text });
    
    // 🔍 Check if the response actually has data
    if (response.data && response.data.success) {
      const roadmapData = response.data.data;
      
      setRoadmap(roadmapData); // Local state for the timeline
      
      // 🟢 IMPORTANT: This sends the data to Dashboard.jsx
      if (typeof setRoadmapData === 'function') {
        setRoadmapData(roadmapData); 
      }
    } else {
      setError("AI returned an empty response. Try again.");
    }
  } catch (err) {
    console.error("Roadmap Error:", err);
    setError("AI failed to build your roadmap. Check your server console.");
  } finally {
    setLoading(false);
  }
};

 return (
    <div className="mt-12 mb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Compass className="text-blue-600" size={32} />
            AI Career Roadmap
          </h2>
          <p className="text-slate-500 mt-2">
            Based on your current study materials, here is your path to the industry.
          </p>
        </div>

        <button 
          onClick={generateRoadmap}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? "Analyzing Path..." : "Generate My Roadmap"}
        </button>
      </div>

      <AnimatePresence>
        {roadmap.length > 0 && (
          <div className="relative">
            {/* 🛤️ The Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-100 rounded-full hidden md:block" />

            <div className="space-y-12">
              {roadmap.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative flex flex-col md:flex-row gap-8 items-start"
                >
                  {/* 🔵 The Step Icon */}
                  <div className="z-10 bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                    {idx === 3 ? <Star size={28} /> : <Briefcase size={28} />}
                  </div>

                  {/* 📄 The Content Card */}
                  <div className="glass flex-1 p-8 rounded-[2.5rem] border border-white/50 hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-blue-600 font-black text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
                        Phase 0{idx + 1}
                      </span>
                      <ChevronRight className="text-slate-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">{step.desc}</p>

                    <div className="flex flex-wrap gap-3">
                      {step.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final Celebration Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-center text-white shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-2">Ready to Launch!</h3>
              <p className="opacity-80">Follow this roadmap to turn your MCA studies into a professional career.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}