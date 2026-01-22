
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TiltCard } from '../components/ui/TiltCard';
import { ScrambleText } from '../components/ui/ScrambleText';
import { MessageSquare, BrainCircuit, BookOpen, FileText, ArrowRight, Zap, Database, Layers, Monitor, Cpu, Globe, Shield, Activity } from 'lucide-react';
import { GlassPillButton } from '../components/ui/GlassPillButton';

const Section = ({ children, className = "" }) => (
    <section className={`py-20 px-6 max-w-7xl mx-auto ${className}`}>
        {children}
    </section>
);

const FeatureCard = ({ title, desc, icon: Icon, delay, color = "cyan" }) => (
    <TiltCard className={`bg-glass-base backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between group hover:bg-white/10 hover:border-${color}-400/30 transition-all duration-500 h-full min-h-[280px]`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="h-full flex flex-col"
        >
            <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-${color}-400 group-hover:scale-110 group-hover:bg-${color}-500/10 transition-all duration-500`}>
                <Icon size={28} />
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-display font-medium mb-3 uppercase tracking-wide group-hover:text-white transition-colors">{title}</h3>
                <p className="text-white/50 leading-relaxed text-sm group-hover:text-white/70 transition-colors">{desc}</p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-white/30 group-hover:text-${color}-400 transition-colors uppercase tracking-widest">
                <span>System Ready</span>
                <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 animate-pulse`} />
            </div>
        </motion.div>
    </TiltCard>
);

const StatTicker = ({ label, value }) => (
    <div className="flex flex-col border-r border-white/10 px-6 last:border-0">
        <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-1">{label}</span>
        <span className="text-lg font-display font-medium text-white/90">{value}</span>
    </div>
);

export default function Home() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-void-base text-white pb-32 overflow-x-hidden" ref={containerRef}>

            {/* Nav Overlay */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void-base/80 backdrop-blur-lg border-b border-white/5 py-4' : 'py-6'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-display font-bold text-xl tracking-tight">ARRIBOT</span>
                    </div>
                    <GlassPillButton onClick={() => navigate('/auth')} className="text-xs px-4 py-2">
                        ACCESS TERMINAL
                    </GlassPillButton>
                </div>
            </motion.nav>

            {/* HERO SECTION */}
            <section className="min-h-screen w-full relative flex items-center justify-center px-6 pt-20">
                {/* Background FX */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mixed-blend-overlay" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full max-w-7xl items-center z-10">
                    {/* Left: Typography */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="font-mono text-cyan-400 text-xs tracking-widest uppercase">
                                SYSTEM v2.0.4 ONLINE
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-medium leading-[0.9] tracking-tighter text-white">
                            NEURAL<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">
                                LEARNING
                            </span><br />
                            MATRIX
                        </h1>

                        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                            Accelerate your cognitive processing with ArriBot.
                            Deploy AI agents to generate flashcards, quizzes, and summaries instantly.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <GlassPillButton onClick={() => navigate('/auth')} className="w-fit group">
                                <span className="flex items-center gap-3">
                                    <ScrambleText text="INITIALIZE PROTOCOL" />
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </span>
                            </GlassPillButton>

                            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-mono text-white/60 hover:text-white uppercase tracking-wider">
                                View System Specs
                            </button>
                        </div>

                        {/* Live Specs Bar */}
                        <div className="mt-12 flex border-y border-white/5 py-6 bg-black/20 backdrop-blur-sm rounded-lg">
                            <StatTicker label="Active Nodes" value="4" />
                            <StatTicker label="Latency" value="14ms" />
                            <StatTicker label="Uptime" value="99.9%" />
                            <StatTicker label="Security" value="Encrypted" />
                        </div>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, duration: 1.2, type: "spring" }}
                        className="relative hidden lg:block"
                        style={{ perspective: 1000 }}
                    >
                        <TiltCard className="w-full aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] border border-white/10 backdrop-blur-2xl p-8 relative overflow-hidden flex items-center justify-center">
                            {/* Inner Circle Animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[80%] h-[80%] border border-cyan-500/20 rounded-full animate-spin-slow-reverse" />
                                <div className="absolute w-[60%] h-[60%] border border-violet-500/20 rounded-full animate-spin-slow" />
                            </div>

                            <div className="relative z-10 text-center space-y-4">
                                <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-3xl mx-auto shadow-2xl shadow-cyan-500/30 flex items-center justify-center mb-6">
                                    <BrainCircuit size={48} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-display font-bold">ARRIBOT CORE</h3>
                                <div className="flex flex-col gap-2 font-mono text-xs text-white/50">
                                    <p className="flex items-center justify-center gap-2">
                                        <Activity size={12} className="text-emerald-400" />
                                        Processing Logic...
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <Database size={12} className="text-cyan-400" />
                                        Accessing Knowledge Base...
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <Shield size={12} className="text-violet-400" />
                                        Secure Connection Verified
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Lines */}
                            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                        </TiltCard>
                    </motion.div>
                </div>
            </section>

            {/* SYSTEM MODULES */}
            <Section className="relative z-10" id="features">
                <div className="text-center mb-16">
                    <span className="font-mono text-cyan-400 text-xs tracking-[0.3em] uppercase mb-4 block">System Capabilities</span>
                    <h2 className="text-4xl md:text-5xl font-display font-medium">DEPLOY ACTIVE AGENTS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Neural Chat"
                        desc="Advanced conversational AI capable of complex reasoning and code generation."
                        icon={MessageSquare}
                        color="cyan"
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Flash Recall"
                        desc="Active recall enforcement through AI-generated flashcard decks."
                        icon={BookOpen}
                        color="violet"
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Cognitive Quiz"
                        desc="Adaptive testing engine that scales difficulty based on performance."
                        icon={BrainCircuit}
                        color="pink"
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Auto-Summarize"
                        desc="Distills vast information into high-density knowledge packets."
                        icon={FileText}
                        color="emerald"
                        delay={0.4}
                    />
                </div>
            </Section>

            {/* ARCHITECTURE SECTION */}
            <Section className="bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-10 hidden lg:block" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-20 p-8 lg:p-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6 font-mono text-violet-400 text-xs tracking-widest uppercase">
                            <Layers size={14} />
                            <span>System Architecture</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-medium mb-8">BUILT ON ADVANCED<br />TECHNOLOGY</h2>

                        <div className="space-y-8">
                            {[
                                { title: 'Backend Core', desc: 'Spring Boot 3.2 · MongoDB · Maven', icon: Cpu, color: 'text-cyan-400' },
                                { title: 'Frontend Interface', desc: 'React 18 · Vite · Tailwind CSS', icon: Monitor, color: 'text-violet-400' },
                                { title: 'Global Network', desc: 'Gemini AI · Groq API · REST Protocol', icon: Globe, color: 'text-emerald-400' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                                        <p className="text-white/50 text-sm font-mono">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 hidden lg:block group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mixture-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="flex items-center justify-between border-t border-white/20 pt-6">
                                <div>
                                    <p className="font-mono text-xs text-white/40 uppercase mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="font-bold">OPERATIONAL</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-xs text-white/40 uppercase mb-1">Region</p>
                                    <span className="font-bold">GLOBAL / AUTOMATIC</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA SECTION */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-full blur-[100px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-display font-medium mb-8 tracking-tight">
                        READY TO<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                            ASCEND?
                        </span>
                    </h2>
                    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
                        Join the neural network. Initialize your learning journey with ArriBot today.
                    </p>

                    <GlassPillButton onClick={() => navigate('/auth')} className="px-10 py-5 text-lg group">
                        <span className="flex items-center gap-3">
                            <Zap size={20} className="group-hover:text-yellow-400 transition-colors" />
                            INITIALIZE SYSTEM
                        </span>
                    </GlassPillButton>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 text-center px-6">
                <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-sm font-mono text-white/30">
                    <p>© 2026 ARRIBOT SYSTEMS. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <span className="hover:text-cyan-400 cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition-colors">TERMS OF USE</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition-colors">SYSTEM STATUS</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}
