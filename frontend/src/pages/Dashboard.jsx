
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScrambleText } from '../components/ui/ScrambleText';
import { TiltCard } from '../components/ui/TiltCard';
import {
    MessageSquare, BookOpen, BrainCircuit, FileText, Activity,
    Zap, Clock, Shield, Briefcase, MapPin, Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiUsageAPI } from '../utils/api';

// ─── Sub-components ───────────────────────────────────────────────────────────

const Widget = ({ title, icon: Icon, delay, onClick, color = "cyan" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        onClick={onClick}
        className={`group relative overflow-hidden rounded-3xl bg-glass-base border border-white/5 p-6 hover:bg-white/10 hover:border-${color}-400/30 transition-all cursor-pointer h-full`}
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-400`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-lg font-display font-medium mb-1">{title}</h3>
                <p className="text-white/40 text-xs font-mono group-hover:text-white/60 transition-colors">
                    Initialize Module &gt;&gt;
                </p>
            </div>
        </div>
    </motion.div>
);

const StatCard = ({ label, value, trend }) => (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col">
        <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{label}</span>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-display font-medium">{value}</span>
            {trend && <span className="text-cyan-400 text-xs mb-1">{trend}</span>}
        </div>
    </div>
);

const LimitBar = ({ label, used, max, color }) => {
    const percentage = Math.min((used / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{label}</span>
                <span className={`text-${color}-400`}>{used}/{max}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-400 transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const TokenMeter = ({ label, value, total, color = "cyan" }) => {
    const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
                <span className="text-white/50">{label}</span>
                <span className={`text-${color}-400 font-mono`}>{value.toLocaleString()}</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r from-${color}-500 to-${color}-300 transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    const [usageStats, setUsageStats] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        if (user) {
            const userId = user.id || user._id;
            aiUsageAPI.getStats(userId)
                .then(res => setUsageStats(res.data))
                .catch(err => console.error("Failed to load usage stats", err));
        }
        return () => clearInterval(timer);
    }, [user]);

    const handleLogout = () => {
        logout();
        toast.success("Logout Successfully", { icon: '👋' });
        navigate('/auth');
    };

    const s = usageStats || {};
    const totalTokens      = s.totalTokensUsed      || 0;
    const promptTokens     = s.promptTokensUsed      || 0;
    const completionTokens = s.completionTokensUsed  || 0;

    return (
        <div className="min-h-screen bg-void-base text-white p-6 pb-24 md:p-12">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-400 tracking-widest">COMMAND_CENTER // ONLINE</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-4xl md:text-5xl font-display font-bold">WELCOME BACK,</h1>
                        <span className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                            <ScrambleText text={user?.fullName?.split(' ')[0]?.toUpperCase() || 'TRAVELER'} />
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-2xl font-mono">{time.toLocaleTimeString([], { hour12: false })}</p>
                        <p className="text-xs text-white/40 font-mono uppercase">{time.toLocaleDateString()}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 px-4 py-2 rounded-xl transition-all font-mono text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-current" />
                        Power Off
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Daily Streak" value="1 Days" trend="🔥" />
                        <StatCard label="Knowledge Pts" value="150" trend="+10" />
                        <StatCard label="System Level" value="v.1.0" />
                        <StatCard
                            label="Total Requests"
                            value={s.totalRequestsToday || 0}
                            trend="Today"
                        />
                    </div>

                    {/* AI Resource Limits */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Daily Resource Limits</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <LimitBar label="Neural Chat"  used={s.chatUsed        || 0} max={s.chatLimit        || 30}  color="cyan"    />
                            <LimitBar label="Flash Recall" used={s.flashcardsUsed  || 0} max={s.flashcardsLimit  || 10}  color="violet"  />
                            <LimitBar label="Cog Quiz"     used={s.quizUsed        || 0} max={s.quizLimit        || 5}   color="pink"    />
                            <LimitBar label="Summarizer"   used={s.summaryUsed     || 0} max={s.summaryLimit     || 10}  color="emerald" />
                        </div>
                    </div>

                    {/* Groq Token Usage Panel */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu size={14} className="text-cyan-400" />
                            <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Groq Token Usage Today</h2>
                            <span className="ml-auto text-lg font-display font-bold text-white">
                                {totalTokens.toLocaleString()}
                                <span className="text-xs text-white/40 font-mono ml-1">tokens</span>
                            </span>
                        </div>
                        <div className="space-y-3">
                            <TokenMeter label="Prompt Tokens"     value={promptTokens}     total={totalTokens} color="cyan"   />
                            <TokenMeter label="Completion Tokens" value={completionTokens} total={totalTokens} color="purple" />
                        </div>

                        {/* Per-feature request counts */}
                        <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Chat',          value: s.chatUsed,              color: 'text-cyan-400'    },
                                { label: 'Flashcards',    value: s.flashcardsUsed,        color: 'text-violet-400'  },
                                { label: 'Quizzes',       value: s.quizUsed,              color: 'text-pink-400'    },
                                { label: 'Summaries',     value: s.summaryUsed,           color: 'text-emerald-400' },
                                { label: 'Learn Paths',   value: s.learningPathsGenerated, color: 'text-amber-400'  },
                                { label: 'Total Req',     value: s.totalRequestsToday,    color: 'text-white/70'    },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="bg-white/[0.03] rounded-xl px-3 py-2 text-center">
                                    <div className={`text-xl font-bold font-mono ${color}`}>{value || 0}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modules Grid */}
                    <h2 className="text-xl font-display font-medium pt-4">ACTIVE MODULES</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Widget title="Neural Chat"    icon={MessageSquare} delay={0.1} onClick={() => navigate('/chat')}          color="cyan"    />
                        <Widget title="Flash Recall"   icon={BookOpen}      delay={0.2} onClick={() => navigate('/flashcards')}    color="violet"  />
                        <Widget title="Cognitive Quiz" icon={BrainCircuit}  delay={0.3} onClick={() => navigate('/quiz')}          color="pink"    />
                        <Widget title="Summarizer"     icon={FileText}      delay={0.4} onClick={() => navigate('/summarize')}     color="emerald" />
                        <Widget title="Resume Analyzer" icon={Briefcase}   delay={0.5} onClick={() => navigate('/resume')}        color="rose"    />
                        <Widget title="Learn Path"     icon={MapPin}        delay={0.6} onClick={() => navigate('/learning-path')} color="amber"   />
                    </div>
                </div>

                {/* Right Column: Activity Stream */}
                <div className="lg:col-span-1">
                    <TiltCard className="h-full min-h-[500px] bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-medium">ACTIVITY LOG</h3>
                            <Activity size={16} className="text-white/40" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            {[
                                { action: 'System Login',          time: 'Just now', icon: Shield },
                                { action: 'Neural Link Established', time: '1m ago', icon: Zap    },
                                { action: 'Workspace Loaded',      time: '2m ago',   icon: Clock  },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                                        <item.icon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80 group-hover:text-white transition-colors">{item.action}</p>
                                        <p className="text-xs text-white/30 font-mono">{item.time}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Token summary widget */}
                            {totalTokens > 0 && (
                                <div className="flex gap-4 items-start group">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <Cpu size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">Groq tokens consumed</p>
                                        <p className="text-xs text-cyan-400/70 font-mono">{totalTokens.toLocaleString()} tokens today</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
                    </TiltCard>
                </div>

            </div>
        </div>
    );
}
