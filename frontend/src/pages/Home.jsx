
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TiltCard } from '../components/ui/TiltCard';
import { ScrambleText } from '../components/ui/ScrambleText';
import { MessageSquare, BrainCircuit, BookOpen, FileText, ArrowRight, Zap, Database, Layers, Monitor, Cpu, Briefcase, Activity, Shield, CheckCircle } from 'lucide-react';
import { GlassPillButton } from '../components/ui/GlassPillButton';

const Section = ({ children, className = "" }) => (
    <section className={`py-24 px-6 max-w-7xl mx-auto ${className}`}>
        {children}
    </section>
);

const FeatureCard = ({ title, desc, icon: Icon, delay, color = "cyan", badge }) => (
    <TiltCard className={`bg-glass-base backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between group hover:bg-white/10 hover:border-${color}-400/30 transition-all duration-500 h-full min-h-[300px]`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-${color}-400 group-hover:scale-110 group-hover:bg-${color}-500/10 transition-all duration-500`}>
                    <Icon size={28} />
                </div>
                {badge && (
                    <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full border border-${color}-500/30 text-${color}-400 bg-${color}-500/10`}>
                        {badge}
                    </span>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-display font-medium mb-3 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-white/50 leading-relaxed text-sm group-hover:text-white/70 transition-colors">{desc}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-white/30 group-hover:text-${color}-400 transition-colors uppercase tracking-widest">
                <span>Deploy Agent</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </TiltCard>
);

// A code-based UI mockup to serve as a "picture" of the app
const DashboardMockup = () => (
    <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-900/20">
        {/* Mockup Header */}
        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <div className="ml-4 h-4 w-32 bg-white/10 rounded-full" />
        </div>

        {/* Mockup Body */}
        <div className="p-6 flex gap-6 h-full">
            {/* Sidebar */}
            <div className="w-16 flex flex-col gap-4 items-center pt-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="h-32 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-white/10 p-4">
                    <div className="w-1/3 h-4 bg-white/20 rounded mb-2" />
                    <div className="w-1/2 h-8 bg-white/10 rounded" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-xl bg-white/5 border border-white/10" />
                    <div className="h-24 rounded-xl bg-white/5 border border-white/10" />
                </div>

                <div className="h-20 rounded-xl bg-white/5 border border-white/10 flex items-center p-4 gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20" />
                    <div className="flex-1 space-y-2">
                        <div className="w-full h-2 bg-white/10 rounded" />
                        <div className="w-2/3 h-2 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl transform translate-y-12">
            <div className="flex items-center gap-3 mb-2">
                <BrainCircuit className="text-cyan-400" size={20} />
                <span className="text-sm font-bold text-white">AI Analysis Complete</span>
            </div>
            <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-violet-400" />
                </div>
                <div className="flex justify-between text-[10px] text-white/50 font-mono">
                    <span>OPTIMIZING</span>
                    <span>98% DONE</span>
                </div>
            </div>
        </div>
    </div>
);

export default function Home() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    return (
        <div className="min-h-screen bg-void-base text-white pb-32 overflow-x-hidden" ref={containerRef}>

            {/* HERO SECTION */}
            <section className="min-h-screen w-full relative flex items-center justify-center px-6 pt-20">
                {/* Background FX */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 opacity-50" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mixed-blend-overlay" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full max-w-7xl items-center z-10">
                    {/* Left: Content */}
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
                                System v2.0 Online
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[0.95] tracking-tighter text-white">
                            Master<br />
                            Any<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">
                                Subject
                            </span>
                        </h1>

                        <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                            Your personalized AI learning studio. Generate flashcards, detailed notes, and resumes instantly.
                            <span className="text-white/50 block mt-2 text-sm">Powered by Google Gemini 1.5 Pro</span>
                        </p>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <GlassPillButton onClick={() => navigate('/auth')} className="w-fit group px-8 py-4 text-lg">
                                <span className="flex items-center gap-3">
                                    <ScrambleText text="START LEARNING" />
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                            </GlassPillButton>
                        </div>

                        <div className="flex items-center gap-6 mt-8 text-xs font-mono text-white/40 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-emerald-400" />
                                <span>Real-time AI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield size={12} className="text-cyan-400" />
                                <span>Secure Data</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, duration: 1.2, type: "spring" }}
                        className="relative hidden lg:block perspective-1000"
                    >
                        <TiltCard className="p-2 bg-gradient-to-br from-white/10 to-transparent rounded-3xl border border-white/5 backdrop-blur-sm">
                            <DashboardMockup />
                        </TiltCard>

                        {/* Decorative background elements behind mockup */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <Section className="relative z-10" id="features">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">INTELLIGENT SUITE</h2>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Five powerful modules working in harmony to accelerate your growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Neural Chat"
                        desc="Your 24/7 AI tutor. Debug code, explain complex theories, or brainstorm ideas with context-aware responses."
                        icon={MessageSquare}
                        color="cyan"
                        Badge="CORE"
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Flash Recall"
                        desc="Transform notes into active recall decks instantly. The most efficient way to memorize new information."
                        icon={BookOpen}
                        color="violet"
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Cognitive Quiz"
                        desc="Test your mastery. Generate adaptive quizzes that identify your weak spots and reinforce learning."
                        icon={BrainCircuit}
                        color="pink"
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Auto-Summarize"
                        desc="Cut through the noise. Condense long articles, papers, or logs into executive summaries."
                        icon={FileText}
                        color="emerald"
                        delay={0.4}
                    />
                    <FeatureCard
                        title="Resume Analyzer"
                        desc="Land your dream job. Get AI-powered feedback on your resume, ATS scoring, and improvement tips."
                        icon={Briefcase}
                        color="rose"
                        badge="NEW"
                        delay={0.5}
                    />
                    <FeatureCard
                        title="Smart Limits"
                        desc="Balanced usage system ensuring fair access to high-performance AI models for all users."
                        icon={Activity}
                        color="amber"
                        delay={0.6}
                    />
                </div>
            </Section>

            {/* FINAL CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] -z-10" />

                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">READY TO START?</h2>
                <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
                    Join thousands of learners accelerating their potential with ArriBot.
                </p>

                <GlassPillButton onClick={() => navigate('/auth')} className="px-10 py-5 text-lg group">
                    <span className="flex items-center gap-3">
                        <Zap size={20} className="group-hover:text-yellow-400 transition-colors" />
                        INITIALIZE SYSTEM
                    </span>
                </GlassPillButton>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 px-6 bg-black/20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span className="font-display font-bold tracking-tight text-lg">ARRIBOT</span>
                    </div>
                    <p className="text-white/30 text-sm font-mono text-center md:text-right">
                        © 2026 ArriBot Systems.<br className="md:hidden" /> Built for the Future.
                    </p>
                </div>
            </footer>

        </div>
    );
}
