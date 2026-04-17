import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, RefreshCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function QuizHub({ text }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // 🔄 New: Clear the quiz if the user uploads a different PDF
  React.useEffect(() => {
    setQuestions([]);
    setShowResults(false);
    setSelectedAnswers({});
  }, [text]);
  
  const generateQuiz = async () => {
    if (!text || text.length < 20) {
      toast.error("Please paste more detailed notes in the Summarizer first!");
      return;
    }
    
    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const response = await API.post('/api/quiz', { text });
      if (response.data.success) {
        setQuestions(response.data.data);
      }
    } catch (err) {
      console.error("Quiz Generation Error:", err);
      alert("AI failed to generate questions. Check your Server terminal.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx, optIdx) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  // Calculate score for the header
  const score = Object.keys(selectedAnswers).filter(
    (key) => questions[key].a === selectedAnswers[key]
  ).length;

  return (
    <div className="mt-12 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BrainCircuit className="text-indigo-600" size={32} />
            AI Quiz Hub
          </h2>
          <p className="text-slate-500 mt-1">Test your knowledge based on your notes above.</p>
        </div>
        
        <button 
          onClick={generateQuiz}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
          {loading ? "AI is Generating..." : "Generate MCQs"}
        </button>
      </div>

      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* --- NEW: Score Card --- */}
            {showResults && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-[2rem] text-white flex justify-between items-center shadow-xl mb-10"
              >
                <div>
                  <h3 className="text-xl font-bold">Quiz Results</h3>
                  <p className="text-indigo-100 text-sm">Great effort on your MCA study session!</p>
                </div>
                <div className="text-3xl font-black bg-white/20 px-6 py-2 rounded-xl">
                  {score} / {questions.length}
                </div>
              </motion.div>
            )}

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="glass p-8 rounded-[2.5rem] border border-white/40">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md shadow-indigo-200">
                        {qIdx + 1}
                    </div>
                  {/* --- FIXED: Added Numbering Here --- */}
                  <h3 className="text-xl font-semibold text-slate-800">
                     {q.q}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = q.a === optIdx;
                    
                    let bgClass = "bg-white/50 border-slate-200 hover:border-indigo-300";
                    if (showResults) {
                      if (isCorrect) bgClass = "bg-emerald-50 border-emerald-500 text-emerald-700";
                      else if (isSelected && !isCorrect) bgClass = "bg-rose-50 border-rose-500 text-rose-700";
                    } else if (isSelected) {
                      bgClass = "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(qIdx, optIdx)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${bgClass}`}
                      >
                        <span className="font-medium">{option}</span>
                        {showResults && isCorrect && <CheckCircle2 size={18} />}
                        {showResults && isSelected && !isCorrect && <XCircle size={18} />}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600"
                  >
                    <span className="font-bold text-slate-800">Explanation:</span> {q.exp}
                  </motion.div>
                )}
              </div>
            ))}

            {!showResults && (
              <div className="flex justify-center mt-10">
                <button 
                  onClick={() => setShowResults(true)}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}