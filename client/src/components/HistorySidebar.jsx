import React, { useEffect, useState } from 'react';
import { Clock, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import API from '../services/api';

export default function HistorySidebar({ userId, onSelectSession, refreshKey }) {
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/api/study/history/${userId}`);
      // Note: Adjusted the URL to /api/study/history to match a clean route structure
      setHistory(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, refreshKey]);

  // 🗑️ Manual Delete Function
  const handleDelete = async (e, sessionId) => {
    e.stopPropagation(); // Prevents opening the session when clicking delete
    
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    setDeletingId(sessionId);
    try {
      const res = await API.delete(`/api/study/delete-session/${sessionId}`);
      if (res.data.success) {
        // Remove from local state immediately for a smooth UI
        setHistory(prev => prev.filter(item => item._id !== sessionId));
      }
    } catch (err) {
      alert("Failed to delete session. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full bg-white p-2 overflow-y-auto">
      <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2 font-sora">
        <Clock className="text-blue-600" size={22} /> Recent Archive
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 bg-slate-50 border-2 border-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-sm">No saved sessions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelectSession(item)}
              className="group relative w-full text-left p-5 rounded-[2rem] bg-white border-2 border-slate-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                
                {/* 🗑️ DELETE BUTTON */}
                <button
                  onClick={(e) => handleDelete(e, item._id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? (
                    <Loader2 size={16} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-slate-800 truncate">{item.title || "Untitled Session"}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{item.summary}</p>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}