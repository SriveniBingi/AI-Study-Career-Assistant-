import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeNotes } from '../services/api';
import { Sparkles, Copy, Loader2, Bookmark, CheckCircle2, Upload, FileText, X } from 'lucide-react'; 
import axios from 'axios';
import toast from 'react-hot-toast'; // 🟢 Added Toast
import API from '../api'; // Adjust the path to wherever you saved api.js

export default function Summarizer({ onTextChange, initialData, onSaveSuccess }) {
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); 

  useEffect(() => {
    if (initialData) {
      setText(initialData.originalText || "");
      setSummary(initialData.summary || "");
      setIsSaved(true);
      setUploadedFile(null); 
    }
  }, [initialData]);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      return toast.error("Please upload a valid PDF file."); // 🚀 Alert replaced
    }

    const MAX_SIZE = 50 * 1024 * 1024; 
    if (file.size > MAX_SIZE) {
      return toast.error("File too large! Max limit is 50MB."); // 🚀 Alert replaced
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await API.post('/api/upload-pdf', formData);
      if (res.data.success) {
        setText(res.data.text); 
        setUploadedFile(file.name); 
        if (onTextChange) onTextChange(res.data.text);
        setIsSaved(false);
        toast.success("PDF analyzed and ready!"); // 🚀 Professional notification
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      if (err.response && err.response.status === 413) {
        toast.error("Server Error: File size exceeds processing limits.");
      } else {
        toast.error("Error reading PDF. Check server connection.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onTextChange) onTextChange(val); 
    setIsSaved(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setText("");
    setSummary("");
    if (onTextChange) onTextChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Workspace cleared");
  };

  const handleAction = async () => {
    if (!text) return toast.error("Please provide text or upload a PDF first."); // 🚀 Alert replaced
    setLoading(true);
    setSummary(""); 
    setIsSaved(false);
    try {
      const { data } = await summarizeNotes(text);
      setSummary(data.data); 
      toast.success("AI Summary Generated!"); // 🚀 Success toast
    } catch (err) {
      console.error(err);
      toast.error("AI processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard!", {
      icon: '📋',
      style: { borderRadius: '12px' }
    });
  };

  const handleSave = async () => {
    if (!summary) return;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = storedUser?.id || "guest";

    setIsSaving(true);
    try {
      const response = await API.post('/api/save-study', {
        userId: currentUserId, 
        title: uploadedFile ? `Notes: ${uploadedFile}` : text.substring(0, 35) + "...",
        summary: summary,
        originalText: text
      });

      if (response.data.success) {
        setIsSaved(true);
        toast.success("Saved to Archive!", {
          icon: '✅',
          style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
        }); // 🚀 Customized success toast
        if (onSaveSuccess) onSaveSuccess(); 
      }
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save session.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 PDF Upload Zone */}
      <motion.div 
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFileUpload(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center justify-center bg-white/50 
          ${dragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-200 hover:border-indigo-300'}`}
      >
        <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-3">
          {loading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
        </div>
        <p className="text-slate-600 font-bold font-sora">
          {loading ? "AI is Extracting Text..." : "Drag & Drop Professional Notes"}
        </p>
        
        <input type="file" ref={fileInputRef} id="pdf-input" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e.target.files[0])} />
        <label htmlFor="pdf-input" className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all uppercase tracking-widest">
          Select Document
        </label>
      </motion.div>

      {/* 🟢 File Chip Section */}
      <AnimatePresence>
        {uploadedFile && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-between bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 truncate max-w-[200px]">{uploadedFile}</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Market Standard PDF Loaded</p>
              </div>
            </div>
            <button onClick={clearFile} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 transition-all">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
        {loading && (
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute top-0 left-0 h-1 bg-blue-500 z-20"
            />
        )}

        <textarea 
          className="w-full h-40 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 resize-none font-bold"
          placeholder="Paste market research or technical material here..."
          value={text} 
          onChange={handleTextChange}
        />

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleAction}
            disabled={loading || !text}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            <span>{loading ? "Processing..." : "Generate AI Insights"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-2xl border-2 border-indigo-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest">
                <Sparkles className="text-indigo-500" size={20} /> Professional Summary
              </h3>
              <button onClick={handleCopy} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <Copy size={18} />
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-8 font-medium italic">"{summary}"</p>
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  isSaved ? "bg-emerald-100 text-emerald-600 cursor-default" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100"
                }`}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : isSaved ? <CheckCircle2 size={18} /> : <Bookmark size={18} />}
                {isSaving ? "Saving..." : isSaved ? "In History" : "Save Insights"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}