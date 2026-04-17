import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api'; // Adjust the path to wherever you saved api.js

const Login = () => {
  const [isResetMode, setIsResetMode] = useState(false); // 🟢 Switch between Login & Reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Handle Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate('/dashboard'); 
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Password Reset ---
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/auth/forgot-password', { email, newPassword });
      toast.success("Password changed! You can now login.");
      setIsResetMode(false); // Go back to login
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Reset failed. Check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30" />

      <motion.div layout className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-300/50 border-2 border-slate-300">
          
          <AnimatePresence mode="wait">
            {!isResetMode ? (
              // 🔵 LOGIN FORM
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Welcome Back!</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Log in to continue your progress</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type="email" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                        placeholder="e.g. user@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
                      Password
                      <button type="button" onClick={() => setIsResetMode(true)} className="text-xs text-blue-600 hover:underline font-bold">Forgot Password?</button>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type={showPassword ? "text" : "password"} required className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                        placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><LogIn size={18} /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              // 🟠 RESET PASSWORD FORM
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setIsResetMode(false)} className="flex items-center gap-1 text-slate-500 hover:text-blue-600 text-sm font-bold mb-6 transition-colors">
                  <ArrowLeft size={16}/> Back to Login
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Verify your email and set a new password</p>
                </div>

                <form onSubmit={handleReset} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Registered Email</label>
                    <input type="email" required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                      placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                    <input type="password" required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                      placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Update Password</span><CheckCircle2 size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account? <button onClick={() => navigate('/signup')} className="text-blue-600 font-bold hover:underline">Sign Up Now</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;