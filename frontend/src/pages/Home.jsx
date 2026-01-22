import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TiltCard } from '../components/ui/TiltCard';
import { ScrambleText } from '../components/ui/ScrambleText';
import {
    MessageSquare,
    BrainCircuit,
    BookOpen,
    FileText,
    ArrowRight,
    Zap,
    Database,
    Layers,
    Monitor,
    Cpu,
    Briefcase
} from 'lucide-react';
import { GlassPillButton } from '../components/ui/GlassPillButton';

/* -------------------- UI HELPERS -------------------- */

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
            <h3 className="text-xl font-display font-medium mb-2 uppercase tracking-wide">
                {title}
            </h3>
            <p className="text-white/50 leading-relaxed text-sm">
                {desc}
            </p>
        </div>
        <div className="mt-6 w-full h-[1px] bg-white/10 group-hover:bg-cyan-500/50 transition-colors" />
    </motion.div>
);

/* -------------------- HOME PAGE -------------------- */

export default function Home() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    return (
        <div
            className="min-h-screen bg-void-base text-white pb-32"
            ref={containerRef}
        >

            {/* ================= HERO ================= */}
            <section className="min-h-screen w-full relative flex items-center justify-center overflow-hidden px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl items-center z-10 pt-20">

                    {/* LEFT */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col gap-4"
                    >
                        <p className="font-mono text-cyan-400/80 text-sm tracking-widest uppercase mb-2">
                            <ScrambleText text=">> SYSTEM READY // ARRIBOT v3.0" />
                        </p>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter">
                            SUPER<br />CHARGE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                                LEARNING
                            </span>
                        </h1>

                        <p className="text-white/60 text-lg leading-relaxed max-w-xl mt-6">
                            ArriBot is an AI-powered learning and career intelligence platform.
                            Learn faster, test smarter, analyze your resume, and prepare for real-world roles using responsible AI systems.
                        </p>

                        <GlassPillButton
                            onClick={() => navigate('/auth')}
                            className="w-fit mt-8 group"
                        >
                            <span className="flex items-center gap-3">
                                <ScrambleText text="INITIALIZE SYSTEM" />
                                <ArrowRight size={18} />
                            </span>
                        </GlassPillButton>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="flex items-center justify-center"
                    >
                        <TiltCard className="w-full max-w-md bg-black/40 rounded-3xl border border-white/10 backdrop-blur-xl p-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-xs font-mono text-white/30">
                                    <span>STATUS: ONLINE</span>
                                    <span>AI ENGINE: GROQ</span>
                                </div>

                                <div className="h-40 rounded-xl border border-white/10 bg-black/50 flex items-center justify-center">
                                    <BrainCircuit size={48} className="text-cyan-400" />
                                </div>

                                <div className="space-y-2 font-mono text-xs text-cyan-300">
                                    <p>&gt; Initializing AI Modules...</p>
                                    <p>&gt; Loading Career Engine...</p>
                                    <p>&gt; System Ready.</p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </section>

            {/* ================= INTRO ================= */}
            <Section className="text-center">
                <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">
                    THE FUTURE OF LEARNING & CAREERS
                </h2>
                <p className="text-white/50 max-w-3xl mx-auto text-lg leading-relaxed">
                    ArriBot eliminates passive learning. Instead of searching endlessly,
                    it generates knowledge, tests understanding, analyzes resumes, and
                    prepares you for interviews using AI-driven intelligence.
                </p>
            </Section>

            {/* ================= SYSTEM MODULES ================= */}
            <Section>
                <div className="flex items-center gap-4 mb-12">
                    <Layers className="text-cyan-400" />
                    <h2 className="text-3xl font-display font-medium">
                        SYSTEM MODULES
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Neural Chat"
                        desc="Ask technical, academic, or conceptual questions and receive instant AI-powered explanations."
                        icon={MessageSquare}
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Flash Recall"
                        desc="Generate smart flashcards for any topic to reinforce memory using active recall."
                        icon={BookOpen}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Cognitive Quiz"
                        desc="Test your understanding with AI-generated quizzes and instant feedback."
                        icon={BrainCircuit}
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Auto Summarize"
                        desc="Convert long articles or notes into clear, concise summaries."
                        icon={FileText}
                        delay={0.4}
                    />
                </div>
            </Section>

            {/* ================= CAREER INTELLIGENCE ================= */}
            <Section>
                <div className="flex items-center gap-4 mb-12">
                    <Briefcase className="text-emerald-400" />
                    <h2 className="text-3xl font-display font-medium">
                        CAREER INTELLIGENCE ENGINE
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            AI Resume Analyzer
                        </h3>
                        <p className="text-white/60 mb-6">
                            Upload your resume and let ArriBot analyze your skills, experience,
                            and job readiness. The system detects gaps and maps a personalized
                            learning path to help you become industry-ready.
                        </p>

                        <ul className="space-y-3 font-mono text-sm text-emerald-300">
                            <li>• Skill Gap Detection</li>
                            <li>• Role-Based Readiness Score</li>
                            <li>• AI Learning Recommendations</li>
                            <li>• Placement-Oriented Insights</li>
                        </ul>
                    </div>

                    <div className="bg-black/40 rounded-xl border border-white/10 flex items-center justify-center p-6">
                        <span className="font-mono text-white/30">
                            [ RESUME → SKILL MAP → LEARNING PATH ]
                        </span>
                    </div>
                </div>
            </Section>

            {/* ================= RESPONSIBLE AI ================= */}
            <Section className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-10">
                    <Cpu className="text-amber-400" />
                    <h2 className="text-3xl font-display font-medium">
                        RESPONSIBLE AI GOVERNANCE
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-black/40 rounded-xl border border-white/10">
                        <h3 className="font-bold text-amber-300 mb-3">AI Usage Limits</h3>
                        <p className="text-white/50 text-sm">
                            Per-user daily AI limits ensure fair usage and prevent API abuse.
                        </p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-xl border border-white/10">
                        <h3 className="font-bold text-amber-300 mb-3">Rate Limiting</h3>
                        <p className="text-white/50 text-sm">
                            Request throttling protects the backend from spam and overload.
                        </p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-xl border border-white/10">
                        <h3 className="font-bold text-amber-300 mb-3">Secure AI Access</h3>
                        <p className="text-white/50 text-sm">
                            All AI endpoints are protected using JWT authentication.
                        </p>
                    </div>
                </div>
            </Section>

            {/* ================= FLOW ================= */}
            <Section>
                <h2 className="text-3xl font-display font-medium text-center mb-16">
                    FROM LEARNING TO CAREER READINESS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                    {[
                        'Upload Resume',
                        'Analyze Skills',
                        'Learn with AI',
                        'Test Knowledge',
                        'Career Ready'
                    ].map((step, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="text-cyan-400 font-mono mb-3">
                                STEP {i + 1}
                            </div>
                            <p className="text-white/60 text-sm">
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ================= CTA ================= */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                    EXPERIENCE THE FUTURE
                </h2>
                <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                    Learn smarter. Prepare faster. Build your career with AI.
                </p>

                <GlassPillButton onClick={() => navigate('/auth')}>
                    START LEARNING NOW
                </GlassPillButton>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm font-mono">
                <p className="mb-2">
                    Built with ❤️ using Spring Boot · React · MongoDB · Groq AI
                </p>
                <p>
                    Designed with responsible AI usage and scalable architecture.
                </p>
            </footer>

        </div>
    );
}
