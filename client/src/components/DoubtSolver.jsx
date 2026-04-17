import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth message pops
import API from '../services/api'; // Adjust the path to wherever you saved api.js

export default function DoubtSolver({ context }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "I'm your AI Career & Study Tutor. Ask me anything about your notes or career path!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 🔄 New: Add a system message when context changes
  useEffect(() => {
    if (context) {
      setMessages([
        { role: 'bot', text: "New context detected! I'm ready to help you with these new notes." }
      ]);
    }
  }, [context]);
  
  // Auto-scroll logic (Perfect as is!)
  useEffect(() => { 
     if (messages.length > 0) {
       chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
     }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 🟢 TIP: Use the /api/ai/chat endpoint we discussed for Groq/OpenRouter speed
      const response = await API.post('/api/ai/chat', {
        prompt: input,
        context: context, // This is the sharedText from your Dashboard
        type: 'doubt'
      });

      // Adjusting this to match the standard response structure
      const botReply = response.data.answer || response.data.data;
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
      
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "I'm having trouble connecting to my brain right now. Please check if the server is running!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-blue-50/50 flex flex-col h-[550px] overflow-hidden">
      {/* Header - Updated to Blue/Emerald theme */}
      <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Doubt Solver</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Powered by Groq LPU</p>
          </div>
        </div>
        {context && (
           <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">
             Context Active
           </span>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.role === 'bot' ? <Bot size={18} className="shrink-0 mt-1 text-blue-500" /> : <User size={18} className="shrink-0 mt-1" />}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs font-medium text-slate-400">Assistant is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input 
          type="text"
          className="flex-1 bg-slate-50 border border-slate-200 outline-none px-5 py-3 rounded-2xl text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          placeholder="Ask about your notes or career advice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          disabled={loading || !input.trim()}
          type="submit" 
          className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}