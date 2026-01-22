
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TiltCard } from '../components/ui/TiltCard';
import { ScrambleText } from '../components/ui/ScrambleText';
import { MessageSquare, BrainCircuit, BookOpen, FileText, ArrowRight, Zap, Database, Layers, Monitor, Cpu } from 'lucide-react';
import { GlassPillButton } from '../components/ui/GlassPillButton';

const Section = ({ children, className = "" }) => (
    <section className={`py-20 px-6 max-w-7xl mx-auto ${className}`}>
        {children}
    </section>
);

const FeatureCard = ({ title, desc, icon: Icon, delay }) => (
    <motion.div
        className="bg-glass-base backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between group hover:bg-white/10 hover:border-cyan-glow/30 transition-all duration-500 h-full min-h-[250px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
    >
        <div>
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <Icon className="text-white/60 group-hover:text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-display font-medium mb-2 uppercase tracking-wide">{title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">{desc}</p>
        </div>
        <div className="mt-6 w-full h-[1px] bg-white/10 group-hover:bg-cyan-500/50 transition-colors" />
    </motion.div>
);

export default function Home() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    return (
        <div className="min-h-screen bg-void-base text-white pb-32" ref={containerRef}>

            {/* HERO SECTION */}
            <section className="min-h-screen w-full relative flex items-center justify-center overflow-hidden px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl items-center z-10 pt-20">
                    {/* Left: Typography */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col gap-4"
                    >
                        <p className="font-mono text-cyan-400/80 text-sm tracking-widest uppercase mb-2">
                            <ScrambleText text=">> SYSTEM READY // v2.0.4" />
                        </p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter text-white mix-blend-overlay opacity-90">
                            SUPER<br />CHARGE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400 opacity-100 mix-blend-normal">
                                SYNAPSES
                            </span>
                        </h1>

                        <p className="text-white/60 text-lg leading-relaxed max-w-xl mt-6">
                            ArriBot is a next-generation AI-powered learning platform designed to accelerate your cognitive processing.
                            Connect to intelligent systems, generate knowledge instantly, and master any subject.
                        </p>

                        <GlassPillButton onClick={() => navigate('/auth')} className="w-fit mt-8 group">
                            <span className="flex items-center gap-3">
                                <ScrambleText text="INITIALIZE SYSTEM" />
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </span>
                        </GlassPillButton>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="flex items-center justify-center relative"
                    >
                        <TiltCard className="w-full max-w-md bg-black/40 rounded-3xl border border-white/10 backdrop-blur-xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50 pointer-events-none" />
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-xs font-mono text-white/30">
                                    <span>STATUS: ONLINE</span>
                                    <span>LATENCY: 12ms</span>
                                </div>
                                <div className="h-40 w-full rounded-xl border border-white/10 bg-black/50 overflow-hidden relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <div className="w-24 h-24 bg-cyan-500 rounded-full blur-[60px] animate-pulse-fast" />
                                    <BrainCircuit className="relative z-10 text-white/80" size={48} />
                                </div>
                                <div className="space-y-2 font-mono text-xs text-cyan-300">
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.5, duration: 0.5 }}
                                    >
                                        &gt; Initiating Neural Link...
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 2.5, duration: 0.5 }}
                                    >
                                        &gt; Optimizing Memory Paths...
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 3.5, duration: 0.5 }}
                                    >
                                        &gt; Access Granted.
                                    </motion.p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Background Wireframe */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 -z-10 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20 animate-spin-slow pointer-events-none">
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-75" />
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-50" />
                </div>
            </section>

            {/* INTRO SECTION */}
            <Section className="text-center">
                <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">THE FUTURE OF LEARNING IS HERE</h2>
                <p className="text-white/50 max-w-3xl mx-auto text-lg leading-relaxed">
                    ArriBot transforms the way you study, understand, and retain information.
                    Instead of searching through endless resources, ArriBot creates knowledge for you in real time.
                    ArriBot adapts to your needs and delivers precise, intelligent, and personalized learning experiences.
                </p>
            </Section>

            {/* SYSTEM MODULES */}
            <Section>
                <div className="flex items-center gap-4 mb-12">
                    <Layers className="text-cyan-400" />
                    <h2 className="text-3xl font-display font-medium">SYSTEM MODULES</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Neural Chat"
                        desc="Advanced AI-powered conversational learning. Ask anything — from coding questions to complex theory."
                        icon={MessageSquare}
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Flash Recall"
                        desc="Turn any topic into instant flashcards. Strengthen memory using active recall algorithms."
                        icon={BookOpen}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Cognitive Quiz"
                        desc="Test your knowledge with AI-generated quizzes. Adaptive difficulty and instant feedback."
                        icon={BrainCircuit}
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Auto-Summarize"
                        desc="Convert long content into clear, concise summaries. Perfect for notes and research."
                        icon={FileText}
                        delay={0.4}
                    />
                </div>
            </Section>

            {/* WHY ARRI BOT */}
            <Section className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-medium mb-6">WHY ARRIBOT?</h2>
                        <p className="text-white/60 mb-8">
                            ArriBot combines AI intelligence, modern UI, and powerful backend systems to create an immersive learning experience.
                        </p>
                        <ul className="space-y-4 font-mono text-sm">
                            {['Powered by Google Gemini AI', 'Clean Futuristic UI', 'Real-time Responses', 'Secure Backend', 'Data Persistence'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-cyan-300">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-64 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                        <span className="text-lg font-mono text-white/30 uppercase tracking-widest">[ SYSTEM ARCHITECTURE VISUAL ]</span>
                    </div>
                </div>
            </Section>

            {/* TECHNOLOGY STACK */}
            <Section>
                <div className="flex items-center gap-4 mb-12">
                    <Cpu className="text-violet-400" />
                    <h2 className="text-3xl font-display font-medium">TECHNOLOGY STACK</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Database size={18} className="text-cyan-400" /> Backend Core</h3>
                        <p className="text-white/50 text-sm mb-4">Spring Boot 3.2 · MongoDB · Maven</p>
                        <p className="text-white/40 text-xs">Handles AI processing, data storage, and business logic.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Monitor size={18} className="text-violet-400" /> Frontend Interface</h3>
                        <p className="text-white/50 text-sm mb-4">React 18 · Vite · Tailwind CSS</p>
                        <p className="text-white/40 text-xs">Delivers smooth animations and a modern interactive experience.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-400" /> DevOps</h3>
                        <p className="text-white/50 text-sm mb-4">Docker · Nginx</p>
                        <p className="text-white/40 text-xs">Ensures scalable deployment and stable performance.</p>
                    </div>
                </div>
            </Section>

            {/* HOW IT WORKS */}
            <Section>
                <h2 className="text-3xl font-display font-medium text-center mb-16">HOW ARRIBOT WORKS</h2>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    {/* Visual Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -z-10 hidden md:block" />

                    {[
                        { step: '01', title: 'User Query', desc: 'Submit your request' },
                        { step: '02', title: 'AI Processing', desc: 'Gemini analyzes text' },
                        { step: '03', title: 'System Logic', desc: 'Backend handles data' },
                        { step: '04', title: 'Response', desc: 'Instant knowledge' }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center bg-void-base p-4 z-10 w-full md:w-auto">
                            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-cyan-400 mb-4">
                                {step.step}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                            <p className="text-white/50 text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* FINAL CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] -z-10" />

                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">EXPERIENCE THE FUTURE</h2>
                <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                    ArriBot isn’t just a platform. It’s a neural interface for your knowledge journey.
                </p>

                <GlassPillButton onClick={() => navigate('/auth')} className="px-8 py-4 text-lg">
                    START LEARNING NOW
                </GlassPillButton>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm font-mono">
                <p className="mb-4">Built with ❤️ using Spring Boot · React · MongoDB · Google Gemini</p>
                <p>© 2026 ArriBot — AI Learning Platform. All Rights Reserved.</p>
            </footer>

        </div>
    );
}
