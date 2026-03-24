import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flashcardsAPI } from '../utils/api';
import { BookOpen, RefreshCw, Zap, BrainCircuit, ArrowRight, ArrowLeft } from 'lucide-react';
import { ScrambleText } from '../components/ui/ScrambleText';
import { TiltCard } from '../components/ui/TiltCard';

const Flashcards = () => {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [flippedCards, setFlippedCards] = useState(new Set());

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim() || isLoading) return;

        setIsLoading(true);
        setFlashcards([]); // Clear old flashcards
        setFlippedCards(new Set()); // Reset flip state

        try {
            const response = await flashcardsAPI.generate(topic, count);
            console.log('Flashcard API Response:', response.data);

            // Ensure we only set the new flashcards (backend returns array directly)
            if (Array.isArray(response.data)) {
                setFlashcards(response.data);
                console.log(`Loaded ${response.data.length} flashcards`);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setFlashcards([]); // Clear on error
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFlip = (index) => {
        setFlippedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-void-base text-white p-4 md:p-8 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-6xl flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse-fast" />
                        <span className="text-xs font-mono text-violet-400 tracking-widest">MEMORY_CORE // ACTIVE</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold"><ScrambleText text="FLASH RECALL" /></h1>
                </div>
                <BookOpen className="text-white/20" size={32} />
            </div>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl mb-12"
            >
                <form onSubmit={handleGenerate} className="bg-glass-base backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wide">Target Subject</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Quantum Mechanics, React Hooks..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-display tracking-wide"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-mono text-white/40 uppercase tracking-wide">Data Nodes</label>
                                <span className="text-xs font-mono text-violet-400">{count} UNITS</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono font-bold tracking-widest rounded-xl hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                            {isLoading ? 'GENERATING NODES...' : 'INITIALIZE RECALL'}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Cards Grid */}
            <AnimatePresence>
                {flashcards.length > 0 && (
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flashcards.map((card, index) => (
                            <div key={index} className="h-[300px]" style={{ perspective: '1000px' }}>
                                <div
                                    className="relative w-full h-full cursor-pointer"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: flippedCards.has(index) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 0.6s'
                                    }}
                                    onClick={() => toggleFlip(index)}
                                >
                                    {/* Front */}
                                    <div
                                        className="absolute inset-0 w-full h-full bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:border-violet-500/30"
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-mono text-violet-400 uppercase border border-violet-500/30 px-2 py-1 rounded">Query_0{index + 1}</span>
                                            <BrainCircuit className="text-white/20 group-hover:text-violet-400 transition-colors" />
                                        </div>

                                        <p className="text-xl font-display font-medium leading-relaxed my-4 relative z-10">
                                            {card.question}
                                        </p>

                                        <p className="text-xs font-mono text-white/30 flex items-center gap-2 group-hover:text-white/60 transition-colors">
                                            Click to Reveal <ArrowRight size={10} />
                                        </p>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className="absolute inset-0 w-full h-full bg-violet-950/40 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-8 flex flex-col justify-between"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-mono text-white/40 uppercase border border-white/10 px-2 py-1 rounded">Data_packet</span>
                                            <Zap className="text-violet-400" />
                                        </div>

                                        <p className="text-lg font-sans text-white/90 leading-relaxed my-4 relative z-10">
                                            {card.answer}
                                        </p>

                                        <p className="text-xs font-mono text-white/30 flex items-center gap-2">
                                            <ArrowLeft size={10} /> Return to Query
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Flashcards;
