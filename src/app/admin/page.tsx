'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Key, 
  ShieldAlert, 
  Users, 
  Activity, 
  Database, 
  LogOut, 
  RefreshCw, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  // Dashboard states
  const [nodeSyncing, setNodeSyncing] = useState(false);
  const [waitlistLocked, setWaitlistLocked] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [outbreakAlertCount, setOutbreakAlertCount] = useState(1);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Verification modal states
  const [showKeyConfirmModal, setShowKeyConfirmModal] = useState(false);
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [confirmErrorMsg, setConfirmErrorMsg] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage/sessionStorage
    const storedAuth = sessionStorage.getItem('swasthya_admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setWaitlistLocked(data.settings.waitlist_locked === 'true');
        setMaintenanceMode(data.settings.maintenance_mode === 'true');
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchWaitlist = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/waitlist');
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations(data.waitlist);
      }
      await fetchSettings();
    } catch (err) {
      console.error('Failed to fetch waitlist:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWaitlist();
    }
  }, [isAuthenticated]);

  const handleToggleWaitlistLock = async () => {
    const newValue = !waitlistLocked;
    setWaitlistLocked(newValue);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'waitlist_locked', value: newValue ? 'true' : 'false' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setWaitlistLocked(!newValue);
      }
    } catch (err) {
      console.error('Failed to update waitlist lock:', err);
      setWaitlistLocked(!newValue);
    }
  };

  const handleConfirmToggleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmKeyInput) {
      setConfirmErrorMsg('Key input cannot be empty.');
      return;
    }

    setConfirmLoading(true);
    setConfirmErrorMsg('');

    try {
      // Step 1: Verify the admin key
      const verifyRes = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: confirmKeyInput }),
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        // Step 2: Toggle the maintenance mode value in DB
        const targetValue = !maintenanceMode;
        const saveRes = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'maintenance_mode', value: targetValue ? 'true' : 'false' }),
        });
        const saveData = await saveRes.json();

        if (saveRes.ok && saveData.success) {
          setMaintenanceMode(targetValue);
          setShowKeyConfirmModal(false);
          setConfirmKeyInput('');
        } else {
          setConfirmErrorMsg(saveData.error || 'Failed to update maintenance setting.');
        }
      } else {
        setConfirmErrorMsg(verifyData.error || 'Authentication key failed. Action denied.');
      }
    } catch (err) {
      setConfirmErrorMsg('Network error. Verify connection and try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) {
      setErrorMsg('Please enter the admin key.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('swasthya_admin_auth', 'true');
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('swasthya_admin_auth');
    setAdminKey('');
  };

  const handleSyncNodes = () => {
    setNodeSyncing(true);
    setTimeout(() => {
      setNodeSyncing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-txt-main font-sans flex flex-col relative overflow-hidden">
      {/* Background glowing ambient elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // LOGIN SCREEN
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-6 relative z-10"
          >
            <div className="w-full max-w-md clay-card p-8 md:p-10 border border-white bg-white/80 backdrop-blur-md shadow-2xl text-center">
              {/* Logo / Badge */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <h1 className="text-2xl font-black text-txt-main tracking-tight uppercase mb-2">
                Swasthya Admin
              </h1>
              <p className="text-sm text-txt-muted mb-8">
                Enter the authorization key to access the intelligence control console.
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-txt-muted" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter Admin Key"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-hidden text-sm text-txt-main placeholder-txt-muted transition-all"
                  />
                </div>

                {errorMsg && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold text-red-500"
                  >
                    {errorMsg}
                  </motion.span>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl clay-btn-primary flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Unlock Console
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-xs text-txt-muted">
                <Link href="/" className="hover:text-primary transition-colors flex items-center justify-center gap-1">
                  ← Back to landing page
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          // ADMIN DASHBOARD
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-6 py-8 md:py-12"
          >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200/60">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                    Secured Node
                  </span>
                </div>
                <h1 className="text-3xl font-black text-txt-main tracking-tight">
                  ADMINISTRATIVE COMMAND CENTER
                </h1>
                <p className="text-sm text-txt-muted">
                  Monitoring regional waitlists, disease signals, and database status.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchWaitlist}
                  disabled={refreshing}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 bg-white text-xs font-bold text-txt-main flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/80 hover:border-red-200 hover:text-red-500 bg-white text-xs font-bold text-txt-muted flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Lock Console
                </button>
              </div>
            </div>

            {/* KPI Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Card 1 */}
              <div className="clay-card p-6 border border-white bg-white/70 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-txt-muted font-bold block uppercase tracking-wider mb-1">
                    Waitlist Users
                  </span>
                  <h3 className="text-3xl font-black text-txt-main">{registrations.length}</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18% this week
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="clay-card p-6 border border-white bg-white/70 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-txt-muted font-bold block uppercase tracking-wider mb-1">
                    Active Outbreaks
                  </span>
                  <h3 className={`text-3xl font-black ${outbreakAlertCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {outbreakAlertCount}
                  </h3>
                  <span className="text-[10px] text-txt-muted block mt-1">
                    Epidemiological threat rating: Low
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${outbreakAlertCount > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="clay-card p-6 border border-white bg-white/70 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-txt-muted font-bold block uppercase tracking-wider mb-1">
                    Synced Nodes
                  </span>
                  <h3 className="text-3xl font-black text-txt-main">14 / 16</h3>
                  <span className="text-[10px] text-emerald-600 block mt-1">
                    Edge processing running normal
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="clay-card p-6 border border-white bg-white/70 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-txt-muted font-bold block uppercase tracking-wider mb-1">
                    Ledger Status
                  </span>
                  <h3 className="text-3xl font-black text-txt-main">Secure</h3>
                  <span className="text-[10px] text-txt-muted block mt-1">
                    12,482 logs synced to block
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - Waitlist Registrants Table & Alerts */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Waitlist Registry Table */}
                <div className="clay-card p-6 md:p-8 border border-white bg-white/70 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-txt-main uppercase tracking-tight">
                        Recent Waitlist Registry
                      </h3>
                      <p className="text-xs text-txt-muted">
                        Active signups awaiting authorization key credentials.
                      </p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs font-extrabold text-txt-muted uppercase tracking-wider">
                          <th className="py-3 px-1">Email Node</th>
                          <th className="py-3 px-2">Proposed Role</th>
                          <th className="py-3 px-2 text-right">Time Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrations.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-xs text-txt-muted font-bold uppercase tracking-wider">
                              No waitlist entries recorded yet.
                            </td>
                          </tr>
                        ) : (
                          registrations.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-1 font-bold text-txt-main">{user.email}</td>
                              <td className="py-4 px-2">
                                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-primary/10 text-primary border border-primary/10">
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right text-xs text-txt-muted font-medium">{user.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Threat Monitoring feed */}
                <div className="clay-card p-6 md:p-8 border border-white bg-white/70 backdrop-blur-md">
                  <h3 className="text-lg font-black text-txt-main uppercase tracking-tight mb-6 pb-4 border-b border-slate-100">
                    Regional Epidemiology Indicators
                  </h3>

                  <div className="flex flex-col gap-4">
                    {/* Outbreak Alert 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-200/50">
                      <div className="p-2 rounded-xl bg-red-100 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-extrabold text-txt-main">Dengue Outbreak Signal Triggered</h4>
                          <span className="text-[10px] text-red-600 font-extrabold uppercase">Critical alert</span>
                        </div>
                        <p className="text-xs text-txt-muted leading-relaxed">
                          Ingestion nodes in District A reported a 27% rise in febrile cases. Recommended allocation: 40 ICU beds to regional hubs.
                        </p>
                      </div>
                    </div>

                    {/* Outbreak Alert 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/30">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-extrabold text-txt-main">CHCs Vaccine Ingestion Confirmed</h4>
                          <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Synced</span>
                        </div>
                        <p className="text-xs text-txt-muted leading-relaxed">
                          All 14 active PHC modules confirmed successful receipt of critical cold chain vaccine shipments. Status verified.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column - Controls Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Control Panel Card */}
                <div className="clay-card p-6 md:p-8 border border-white bg-white/70 backdrop-blur-md">
                  <h3 className="text-lg font-black text-txt-main uppercase tracking-tight mb-6 pb-4 border-b border-slate-100">
                    Console Controls
                  </h3>

                  <div className="flex flex-col gap-5">
                    {/* Action 1: Node Sync */}
                    <div>
                      <h4 className="text-xs font-extrabold text-txt-muted uppercase tracking-wider mb-2">Sync Nodes</h4>
                      <button
                        onClick={handleSyncNodes}
                        disabled={nodeSyncing}
                        className="w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-txt-main flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${nodeSyncing ? 'animate-spin' : ''}`} />
                        {nodeSyncing ? 'Synchronizing Nodes...' : 'Synchronize PHC Ingestion'}
                      </button>
                    </div>

                    {/* Action 2: Trigger Alert Simulation */}
                    <div>
                      <h4 className="text-xs font-extrabold text-txt-muted uppercase tracking-wider mb-2">Epidemic Simulation</h4>
                      <button
                        onClick={() => setOutbreakAlertCount(prev => prev === 0 ? 1 : 0)}
                        className="w-full py-3.5 rounded-xl clay-btn-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        {outbreakAlertCount > 0 ? 'Clear Simulated Alarm' : 'Inject Simulated Disease Signal'}
                      </button>
                    </div>

                    {/* Action 3: Lock Waitlist Switch */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-txt-main uppercase tracking-wider">Lock Waitlist</h4>
                        <p className="text-[10px] text-txt-muted">Close signup and shut the join button</p>
                      </div>
                      <button
                        onClick={handleToggleWaitlistLock}
                        className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                          waitlistLocked ? 'bg-primary' : 'bg-slate-200'
                        }`}
                      >
                        <div 
                          className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${
                            waitlistLocked ? 'translate-x-5.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Action 4: Maintenance Placeholder Switch */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-txt-main uppercase tracking-wider">Maintenance Placeholder</h4>
                        <p className="text-[10px] text-txt-muted">Put entire website under maintenance</p>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmErrorMsg('');
                          setConfirmKeyInput('');
                          setShowKeyConfirmModal(true);
                        }}
                        className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                          maintenanceMode ? 'bg-primary' : 'bg-slate-200'
                        }`}
                      >
                        <div 
                          className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${
                            maintenanceMode ? 'translate-x-5.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secure Outpost Badge */}
                <div className="rounded-2xl border border-slate-200/50 bg-slate-50 p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-txt-muted shrink-0" />
                  <div>
                    <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider">Session Expires</span>
                    <span className="text-xs text-txt-main font-semibold">23 minutes remaining</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal for Maintenance Toggle */}
      <AnimatePresence>
        {showKeyConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-xl font-black text-txt-main tracking-tight uppercase mb-2">
                Verify Admin Identity
              </h3>
              <p className="text-xs md:text-sm text-txt-muted mb-6 leading-relaxed">
                You are about to toggle the global website Maintenance Placeholder. Please enter the administrative key to authorize this action.
              </p>

              <form onSubmit={handleConfirmToggleMaintenance} className="flex flex-col gap-4">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-txt-muted" />
                  <input
                    type="password"
                    value={confirmKeyInput}
                    onChange={(e) => {
                      setConfirmKeyInput(e.target.value);
                      if (confirmErrorMsg) setConfirmErrorMsg('');
                    }}
                    placeholder="Enter Admin Key"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-hidden text-sm text-txt-main placeholder-txt-muted transition-all"
                  />
                </div>

                {confirmErrorMsg && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold text-red-500"
                  >
                    {confirmErrorMsg}
                  </motion.span>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowKeyConfirmModal(false);
                      setConfirmKeyInput('');
                      setConfirmErrorMsg('');
                    }}
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-txt-muted cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={confirmLoading}
                    className="flex-1 py-3.5 rounded-2xl clay-btn-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    {confirmLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
