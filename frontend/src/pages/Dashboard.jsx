
import { aiUsageAPI } from '../utils/api';

// ... existing imports

const LimitBar = ({ label, current, max, color }) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{label}</span>
                <span className={`text-${color}-400`}>{current}/{max}</span>
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

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    const [usageStats, setUsageStats] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        // Fetch AI Usage Stats
        if (user) {
            const userId = user.id || user._id;
            aiUsageAPI.getStats(userId)
                .then(res => setUsageStats(res.data))
                .catch(err => console.error("Failed to load usage stats", err));
        }

        return () => clearInterval(timer);
    }, [user]);

    // ... existing handleLogout and render ...

    return (
        <div className="min-h-screen bg-void-base text-white p-6 pb-24 md:p-12">

            {/* ... Header ... */}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Daily Streak" value="1 Days" trend="🔥" />
                        <StatCard label="Knowledge Pts" value="150" trend="+10" />
                        <StatCard label="System Level" value="v.1.0" />
                        <StatCard
                            label="Total Requests"
                            value={usageStats?.totalRequestsToday || 0}
                            trend="Today"
                        />
                    </div>

                    {/* AI Resource Limits Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Daily Resource Limits</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <LimitBar label="Neural Chat" current={30 - (usageStats?.chatRemaining || 30)} max={30} color="cyan" />
                            <LimitBar label="Flash Recall" current={10 - (usageStats?.flashcardsRemaining || 10)} max={10} color="violet" />
                            <LimitBar label="Cog Quiz" current={5 - (usageStats?.quizRemaining || 5)} max={5} color="pink" />
                            <LimitBar label="Summarizer" current={10 - (usageStats?.summaryRemaining || 10)} max={10} color="emerald" />
                        </div>
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
                        <Widget
                            title="Resume Analyzer"
                            icon={FileText}
                            delay={0.5}
                            onClick={() => navigate('/resume')}
                            color="rose"
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
                                { action: 'System Login', time: 'Just now', icon: Shield },
                                { action: 'Neural Link Established', time: '1m ago', icon: Zap },
                                { action: 'Workspace Loaded', time: '2m ago', icon: Clock },
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
