
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const TYPING_DELAY = 50;
const PAUSE_DELAY = 2000;

const DEMO_SCENARIO = [
    { type: 'user', text: "Explain quantum entanglement like I'm 5." },
    { type: 'ai', text: "Imagine two magic dice. 🎲🎲 If you roll a 6 on one, the other INSTANTLY shows a 6, even if it's across the universe! They are 'entangled'—connected in a mysterious way that defies space." }
];

export const LiveDemo = () => {
    const [text, setText] = useState('');
    const [phase, setPhase] = useState(0); // 0: User Typing, 1: AI Thinking, 2: AI Typing, 3: Pause
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        let timeout;

        if (phase === 0) {
            // User Typing
            if (charIndex < DEMO_SCENARIO[0].text.length) {
                timeout = setTimeout(() => {
                    setText(prev => prev + DEMO_SCENARIO[0].text[charIndex]);
                    setCharIndex(prev => prev + 1);
                }, TYPING_DELAY);
            } else {
                setPhase(1);
                setTimeout(() => setPhase(2), 1000); // Simulate network latency
                setCharIndex(0);
                setText('');
            }
        } else if (phase === 2) {
            // AI Typing
            if (charIndex < DEMO_SCENARIO[1].text.length) {
                timeout = setTimeout(() => {
                    setText(prev => prev + DEMO_SCENARIO[1].text[charIndex]);
                    setCharIndex(prev => prev + 1);
                }, 30); // Faster typing for AI
            } else {
                setPhase(3);
            }
        } else if (phase === 3) {
            // Pause before restart
            timeout = setTimeout(() => {
                setPhase(0);
                setCharIndex(0);
                setText('');
            }, PAUSE_DELAY);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, phase]);

    return (
        <div className="w-full max-w-4xl mx-auto mt-20 p-1">
            <div className="flex items-center gap-2 mb-4 px-4">
                <Terminal className="text-aurora-accent animate-pulse" size={20} />
                <span className="text-sm font-mono text-aurora-light/70 uppercase tracking-widest">Live Gemini Demo</span>
            </div>

            <div className="relative bg-glass-surface/50 border border-glass-border backdrop-blur-md rounded-2xl p-6 min-h-[160px] overflow-hidden">
                {/* User Query Display (during AI phase) */}
                {phase >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex justify-end"
                    >
                        <div className="bg-aurora-purple/30 px-4 py-2 rounded-2xl rounded-tr-sm border border-aurora-light/20 text-sm md:text-base">
                            {DEMO_SCENARIO[0].text}
                        </div>
                    </motion.div>
                )}

                {/* Typing Area */}
                <div className="font-mono text-lg md:text-xl leading-relaxed">
                    {phase === 0 && (
                        <span className="text-aurora-light font-sans">{text}<span className="animate-pulse">|</span></span>
                    )}

                    {phase === 1 && (
                        <div className="flex items-center gap-2 text-aurora-accent">
                            <span className="w-2 h-2 bg-aurora-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-aurora-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-aurora-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}

                    {phase >= 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-white drop-shadow-md text-glow">{text}</span>
                            {phase === 2 && <span className="inline-block w-2 h-5 ml-1 bg-aurora-accent animate-pulse align-middle" />}
                        </motion.div>
                    )}
                </div>

                {/* Background Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
            </div>
        </div>
    );
};
