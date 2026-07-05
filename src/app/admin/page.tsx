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
  MapPin,
  MessageSquare,
  Send,
  User
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
  const [projectCompletion, setProjectCompletion] = useState('60');
  const [outbreakAlertCount, setOutbreakAlertCount] = useState(1);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Verification modal states
  const [showKeyConfirmModal, setShowKeyConfirmModal] = useState(false);
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [confirmErrorMsg, setConfirmErrorMsg] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Forum / Objectives states
  const [adminUsername, setAdminUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [objectives, setObjectives] = useState<any[]>([]);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newObjectiveContent, setNewObjectiveContent] = useState('');
  const [newCommentContents, setNewCommentContents] = useState<{ [key: number]: string }>({});
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage/sessionStorage
    const storedAuth = sessionStorage.getItem('swasthya_admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedUsername = localStorage.getItem('swasthya_admin_username');
    if (savedUsername) {
      setAdminUsername(savedUsername);
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
        if (data.settings.project_completion !== undefined) {
          setProjectCompletion(data.settings.project_completion);
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchObjectives = async () => {
    try {
      const res = await fetch('/api/admin/objectives');
      const data = await res.json();
      if (res.ok && data.success) {
        setObjectives(data.objectives);
      }
    } catch (err) {
      console.error('Failed to fetch objectives:', err);
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
      await fetchObjectives();
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

  const handleUpdateCompletion = async (val: string) => {
    try {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0 || num > 100) {
        alert('Please enter a valid percentage between 0 and 100.');
        return;
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'project_completion', value: num.toString() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjectCompletion(num.toString());
        alert('Project completion percentage saved successfully!');
      } else {
        alert(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Failed to update project completion:', err);
      alert('Network error. Failed to save.');
    }
  };

  const handleSetUsername = async () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setUsernameError('Username cannot be empty.');
      return;
    }

    setUsernameError('');
    try {
      const res = await fetch('/api/admin/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('swasthya_admin_username', data.username);
        setAdminUsername(data.username);
      } else {
        setUsernameError(data.error || 'Failed to claim username.');
      }
    } catch (err) {
      setUsernameError('Network error. Please try again.');
    }
  };

  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveTitle.trim() || !newObjectiveContent.trim() || !adminUsername) return;
    try {
      const res = await fetch('/api/admin/objectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername,
          title: newObjectiveTitle.trim(),
          content: newObjectiveContent.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setObjectives([data.objective, ...objectives]);
        setNewObjectiveTitle('');
        setNewObjectiveContent('');
      }
    } catch (err) {
      console.error('Failed to create objective:', err);
    }
  };

  const handleCreateComment = async (objectiveId: number) => {
    const content = newCommentContents[objectiveId];
    if (!content || !content.trim() || !adminUsername) return;
    try {
      const res = await fetch('/api/admin/objectives/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective_id: objectiveId,
          username: adminUsername,
          content: content.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setObjectives(objectives.map(obj => {
          if (obj.id === objectiveId) {
            return {
              ...obj,
              comments: [...obj.comments, data.comment]
            };
          }
          return obj;
        }));
        setNewCommentContents({
          ...newCommentContents,
          [objectiveId]: ''
        });
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
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
                  <span className="text-[10px] text-txt-muted block mt-1">
                    Total active registrants
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
                    {outbreakAlertCount > 0 ? 'Threat rating: Elevated' : 'Threat rating: Normal'}
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
                    Project Progress
                  </span>
                  <h3 className="text-3xl font-black text-txt-main">{projectCompletion}%</h3>
                  <span className="text-[10px] text-txt-muted block mt-1">
                    Configured progress value
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
                    Forum Objectives
                  </span>
                  <h3 className="text-3xl font-black text-txt-main">{objectives.length}</h3>
                  <span className="text-[10px] text-txt-muted block mt-1">
                    Collaborative milestones posted
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

                    {/* Action 5: Project Completion Percentage */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-xs font-extrabold text-txt-main uppercase tracking-wider">Project Completion</h4>
                          <p className="text-[10px] text-txt-muted">Adjust current progress on landing page</p>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                          {projectCompletion}%
                        </span>
                      </div>
                      
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateCompletion(projectCompletion);
                        }} 
                        className="flex items-center gap-3"
                      >
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={projectCompletion}
                            onChange={(e) => setProjectCompletion(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-txt-main focus:outline-none focus:border-primary bg-white pr-7"
                            placeholder="60"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-txt-muted pointer-events-none">%</span>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-primary/95 transition-colors cursor-pointer shadow-xs"
                        >
                          Save
                        </button>
                      </form>
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

            {/* Bottom Row - Objectives Board & Regional Epidemiology */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
              
              {/* Left Column: Objectives Board (Forum) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Objectives Board (Forum) */}
                <div className="clay-card p-6 md:p-8 border border-white bg-white/70 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-txt-main uppercase tracking-tight">
                        Objectives Board
                      </h3>
                      <p className="text-xs text-txt-muted">
                        Post design goals, milestone discussions, and code threads.
                      </p>
                    </div>
                    {adminUsername && (
                      <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        @{adminUsername}
                      </span>
                    )}
                  </div>

                  {/* Section A: Set Username (Lock Profile) */}
                  {!adminUsername ? (
                    <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/50 flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                            Establish Administrative Profile
                          </h4>
                          <p className="text-xs text-amber-700/80 leading-relaxed mt-1">
                            Choose your username to collaborate on the board. Note: Once set, your username cannot be modified.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={usernameInput}
                          onChange={(e) => {
                            setUsernameInput(e.target.value);
                            if (usernameError) setUsernameError('');
                          }}
                          placeholder="e.g. Mahi"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-primary focus:outline-hidden text-xs text-txt-main placeholder-txt-muted transition-all"
                        />
                        <button
                          onClick={handleSetUsername}
                          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-xs font-bold text-white cursor-pointer transition-colors shadow-xs"
                        >
                          Set Profile
                        </button>
                      </div>
                      {usernameError && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-semibold text-red-500"
                        >
                          {usernameError}
                        </motion.span>
                      )}
                    </div>
                  ) : (
                    /* Section B: Create Objective Form */
                    <form onSubmit={handleCreateObjective} className="flex flex-col gap-4 mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/40">
                      <h4 className="text-xs font-extrabold text-txt-main uppercase tracking-wider">
                        Publish New Objective
                      </h4>
                      <input
                        type="text"
                        value={newObjectiveTitle}
                        onChange={(e) => setNewObjectiveTitle(e.target.value)}
                        placeholder="Objective Title (e.g. Optimize Ingestion Speed)"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:outline-hidden text-xs text-txt-main placeholder-txt-muted transition-all"
                      />
                      <textarea
                        value={newObjectiveContent}
                        onChange={(e) => setNewObjectiveContent(e.target.value)}
                        placeholder="Detail the objective or milestone..."
                        required
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:outline-hidden text-xs text-txt-main placeholder-txt-muted transition-all resize-none"
                      />
                      <button
                        type="submit"
                        className="self-end px-5 py-2.5 rounded-xl clay-btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Publish Thread
                      </button>
                    </form>
                  )}

                  {/* Section C: Objectives List */}
                  <div className="flex flex-col gap-6">
                    {objectives.length === 0 ? (
                      <div className="text-center py-8 text-xs text-txt-muted font-bold uppercase tracking-wider border-2 border-dashed border-slate-100 rounded-2xl">
                        No active objectives posted.
                      </div>
                    ) : (
                      objectives.map((obj) => (
                        <div key={obj.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-4">
                          {/* Thread Title & Author metadata */}
                          <div>
                            <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider mb-1">
                              Posted by @{obj.username} • {new Date(obj.created_at).toLocaleDateString()}
                            </span>
                            <h4 className="text-sm font-black text-txt-main">{obj.title}</h4>
                            <p className="text-xs text-txt-muted leading-relaxed mt-2 whitespace-pre-wrap">
                              {obj.content}
                            </p>
                          </div>

                          {/* Nested Comment Section (Replies) */}
                          <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                            <span className="text-[9px] text-txt-muted font-extrabold uppercase tracking-wider flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Replies ({obj.comments?.length || 0})
                            </span>

                            {/* Comment thread list */}
                            {obj.comments && obj.comments.length > 0 && (
                              <div className="flex flex-col gap-2 pl-4 border-l border-slate-100">
                                {obj.comments.map((comment: any) => (
                                  <div key={comment.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                    <span className="text-[9px] text-txt-muted font-bold block mb-1">
                                      @{comment.username} • {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                    <p className="text-xs text-txt-main leading-relaxed">
                                      {comment.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Comment reply input */}
                            {adminUsername ? (
                              <div className="flex gap-2 mt-2">
                                <input
                                  type="text"
                                  value={newCommentContents[obj.id] || ''}
                                  onChange={(e) =>
                                    setNewCommentContents({
                                      ...newCommentContents,
                                      [obj.id]: e.target.value
                                    })
                                  }
                                  placeholder="Write a reply..."
                                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:outline-hidden text-xs text-txt-main placeholder-txt-muted transition-all"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCreateComment(obj.id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleCreateComment(obj.id)}
                                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-txt-main cursor-pointer transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-txt-muted italic mt-1">
                                Establish username to post replies.
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Regional Epidemiology Indicators */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Threat Monitoring feed */}
                <div className="clay-card p-6 md:p-8 border border-white bg-white/70 backdrop-blur-md">
                  <h3 className="text-lg font-black text-txt-main uppercase tracking-tight mb-6 pb-4 border-b border-slate-100">
                    Regional Epidemiology Indicators
                  </h3>

                  <div className="flex flex-col gap-4">
                    {outbreakAlertCount > 0 ? (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-200/50 animate-pulse">
                        <div className="p-2 rounded-xl bg-red-100 text-red-500">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-extrabold text-txt-main">Simulated Outbreak Injected</h4>
                            <span className="text-[10px] text-red-600 font-extrabold uppercase">Critical Alert</span>
                          </div>
                          <p className="text-xs text-txt-muted leading-relaxed">
                            Simulated disease signal is active. Monitoring ingestion nodes for abnormal health pattern spikes.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/30">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-extrabold text-txt-main">Epidemic Stream Normal</h4>
                            <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Clear</span>
                          </div>
                          <p className="text-xs text-txt-muted leading-relaxed">
                            All localized processing nodes report case ingestion counts within baseline limits.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/30">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-extrabold text-txt-main">Waitlist Registry Synced</h4>
                          <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Online</span>
                        </div>
                        <p className="text-xs text-txt-muted leading-relaxed">
                          Secure database connection verified. {registrations.length} active beta user waitlist records loaded.
                        </p>
                      </div>
                    </div>
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
