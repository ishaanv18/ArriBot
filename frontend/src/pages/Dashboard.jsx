
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScrambleText } from '../components/ui/ScrambleText';
import { TiltCard } from '../components/ui/TiltCard';
import { MessageSquare, BookOpen, BrainCircuit, FileText, Activity, Zap, Clock, Shield } from 'lucide-react';

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

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-void-base text-white p-6 pb-24 md:p-12">

            {/* Header / Command Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-400 tracking-widest">COMMAND_CENTER // ONLINE</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold">
                        WELCOME BACK, <span className="text-white/60">{user?.fullName?.split(' ')[0] || 'USER'}</span>
                    </h1>
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

                {/* Left Column: Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Daily Streak" value="12 Days" trend="🔥" />
                        <StatCard label="Knowledge Pts" value="8,450" trend="+120" />
                        <StatCard label="Cards Mastered" value="1,240" />
                        <StatCard label="System Level" value="v.4.2" />
                    </div>

                    {/* Modules Grid */}
                    <h2 className="text-xl font-display font-medium pt-4">ACTIVE MODULES</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                        <Widget
                            title="Neural Chat"
                            icon={MessageSquare}
                            delay={0.1}
                            onClick={() => navigate('/chat')}
                            color="cyan"
                        />
                        <Widget
                            title="Flash Recall"
                            icon={BookOpen}
                            delay={0.2}
                            onClick={() => navigate('/flashcards')}
                            color="violet"
                        />
                        <Widget
                            title="Cognitive Quiz"
                            icon={BrainCircuit}
                            delay={0.3}
                            onClick={() => navigate('/quiz')}
                            color="pink"
                        />
                        <Widget
                            title="Summarizer"
                            icon={FileText}
                            delay={0.4}
                            onClick={() => navigate('/summarize')}
                            color="emerald"
                        />
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
                                { action: 'Completed Quiz: Algebra', time: '2m ago', icon: BrainCircuit },
                                { action: 'Generated Flashcards', time: '14m ago', icon: Zap },
                                { action: 'Chat Session: Physics', time: '1h ago', icon: MessageSquare },
                                { action: 'System Update', time: '4h ago', icon: Shield },
                                { action: 'Study Streak', time: '1d ago', icon: Clock },
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
                        </div>

                        {/* Decor */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
                    </TiltCard>
                </div>

            </div>
        </div>
    );
}
