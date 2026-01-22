import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { summaryAPI } from '../utils/api';
import { FileText, ArrowRight, RefreshCw, Layers, Database, Sparkles, X } from 'lucide-react';
import { ScrambleText } from '../components/ui/ScrambleText';

const Summarization = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        setIsLoading(true);
        setSummary(null);

        try {
            const response = await summaryAPI.summarize(inputText);
            setSummary(response.data);
        } catch (error) {
            console.error('Error summarizing text:', error);
            // alert('Failed to summarize text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setInputText('');
        setSummary(null);
    };

    const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

    return (
        <div className="min-h-screen bg-void-base text-white p-4 md:p-8 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-6xl flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-fast" />
                        <span className="text-xs font-mono text-emerald-400 tracking-widest">DATA_COMPRESSOR // READY</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold"><ScrambleText text="AUTO-SUMMARIZE" /></h1>
                </div>
                <FileText className="text-white/20" size={32} />
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">

                {/* Input Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full"
                >
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-xs font-mono text-white/40 uppercase">Raw Data Input</span>
                        <span className="text-xs font-mono text-emerald-400">{wordCount} WORDS</span>
                    </div>

                    <div className="bg-glass-base backdrop-blur-md border border-white/10 rounded-3xl p-6 flex-1 relative overflow-hidden flex flex-col group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="// Paste text stream for compression..."
                            className="flex-1 bg-transparent border-none resize-none focus:outline-none text-white/80 font-mono text-sm leading-relaxed placeholder-white/20 custom-scrollbar"
                            spellCheck="false"
                        />

                        <div className="h-[1px] w-full bg-white/10 my-4" />

                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleReset}
                                className={`text-white/40 hover:text-white transition-colors text-xs font-mono uppercase flex items-center gap-1 ${!inputText && 'invisible'}`}
                            >
                                <X size={12} /> Clear Buffer
                            </button>

                            <button
                                onClick={handleSummarize}
                                disabled={isLoading || !inputText.trim()}
                                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-xl font-mono text-sm font-bold tracking-widest hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Layers size={16} />}
                                {isLoading ? 'COMPRESSING...' : 'SUMMARIZE'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Output Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full"
                >
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-xs font-mono text-white/40 uppercase">Compressed Knowledge</span>
                        <div className="flex items-center gap-2">
                            <Database size={12} className="text-violet-400" />
                            <span className="text-xs font-mono text-violet-400">OUTPUT MODE</span>
                        </div>
                    </div>

                    <div className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 opacity-50 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {!summary && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-white/20"
                                >
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-mono text-sm">Awaiting Data Stream...</p>
                                </motion.div>
                            )}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center w-full"
                                >
                                    <div className="w-full max-w-[200px] mx-auto h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-emerald-400 animate-progress-indeterminate" />
                                    </div>
                                    <div className="font-mono text-xs text-emerald-400 animate-pulse">
                                        ANALYZING SEMANTIC NODES...
                                    </div>
                                </motion.div>
                            )}

                            {summary && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="text-lg font-sans leading-relaxed text-white/90">
                                            {summary.summarizedText}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-xs text-white/40 mb-1">Reduction Rate</p>
                                            <p className="text-xl font-display font-medium text-emerald-400">
                                                {Math.round((1 - summary.summarizedText.trim().split(/\s+/).length / summary.originalText.trim().split(/\s+/).length) * 100)}%
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-xs text-white/40 mb-1">Final Density</p>
                                            <p className="text-xl font-display font-medium text-white">
                                                {summary.summarizedText.trim().split(/\s+/).length} Words
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Summarization;
