import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Sparkles, ChevronDown, ChevronUp, Check, Circle, 
    BookOpen, BrainCircuit, FileText, Plus, Trash2, Loader2,
    Target, Calendar, Lock, Unlock, GraduationCap, LayoutList
} from 'lucide-react';
import toast from 'react-hot-toast';
import learningPathService from '../services/learningPathService';

// ─── Task badge colours ───────────────────────────────────────────────────────
const TASK_META = {
    FLASHCARD: { icon: BookOpen,     label: 'Flashcards', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/40' },
    QUIZ:      { icon: BrainCircuit, label: 'Quiz',       color: 'text-cyan-400',   bg: 'bg-cyan-500/15   border-cyan-500/40'   },
    SUMMARY:   { icon: FileText,     label: 'Summary',    color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/40' },
};

// ─── DayCard ─────────────────────────────────────────────────────────────────
function DayCard({ day, weekNum, pathId, onToggle }) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await onToggle(pathId, weekNum, day.dayNumber, !day.completed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            layout
            className={`relative flex gap-4 p-4 rounded-xl border transition-all duration-300 ${
                day.completed
                    ? 'bg-white/5 border-white/10 opacity-60'
                    : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30 hover:bg-white/5'
            }`}
        >
            {/* Day number + check */}
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    day.completed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-white/5 border-white/20 text-white/40 hover:border-cyan-400 hover:text-cyan-400'
                }`}
            >
                {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : day.completed ? (
                    <Check size={14} />
                ) : (
                    <span className="text-xs font-bold font-mono">D{day.dayNumber}</span>
                )}
            </button>

            {/* Day info */}
            <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm mb-1 ${day.completed ? 'line-through text-white/40' : 'text-white'}`}>
                    {day.topic}
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-3">{day.description}</p>

                {/* Task badges */}
                <div className="flex flex-wrap gap-2">
                    {day.scheduledTasks?.map(task => {
                        const meta = TASK_META[task] || {};
                        const Icon = meta.icon || Circle;
                        return (
                            <span key={task} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.bg} ${meta.color}`}>
                                <Icon size={11} />
                                {meta.label || task}
                            </span>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

// ─── WeekAccordion ────────────────────────────────────────────────────────────
function WeekAccordion({ week, pathId, onToggleMilestone }) {
    const [open, setOpen] = useState(week.weekNumber === 1);

    const completedCount = week.days?.filter(d => d.completed).length || 0;
    const totalDays = week.days?.length || 0;
    const pct = totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-4 px-5 py-4 bg-white/[0.03] hover:bg-white/5 transition-colors text-left"
            >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400 font-mono">W{week.weekNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{week.weekTitle}</div>
                    <div className="text-xs text-white/40 truncate">{week.weekGoal}</div>
                </div>
                {/* Progress pill */}
                <div className="flex items-center gap-2 ml-2">
                    <div className="hidden sm:flex h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    <span className="text-xs text-white/40 font-mono">{completedCount}/{totalDays}</span>
                    {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </div>
            </button>

            {/* Days */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-2 grid gap-3">
                            {week.days?.map(day => (
                                <DayCard
                                    key={day.dayNumber}
                                    day={day}
                                    weekNum={week.weekNumber}
                                    pathId={pathId}
                                    onToggle={onToggleMilestone}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── PathCard (List view) ─────────────────────────────────────────────────────
function PathCard({ path, onSelect, onDelete }) {
    const totalDays = path.weeks?.reduce((s, w) => s + (w.days?.length || 0), 0) || 0;
    const completedDays = path.weeks?.reduce((s, w) => s + (w.days?.filter(d => d.completed).length || 0), 0) || 0;
    const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 hover:bg-white/5 transition-all cursor-pointer"
            onClick={() => onSelect(path)}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <GraduationCap size={16} className="text-cyan-400 flex-shrink-0" />
                        <h3 className="font-bold text-white truncate">{path.goal}</h3>
                    </div>
                    <p className="text-xs text-white/50 mb-3 line-clamp-2">{path.description}</p>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {path.totalWeeks}w</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs ${
                            path.difficultyLevel === 'Beginner'     ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                            path.difficultyLevel === 'Intermediate' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' :
                                                                      'border-red-500/40 text-red-400 bg-red-500/10'
                        }`}>{path.difficultyLevel}</span>
                    </div>
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onDelete(path.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Progress</span>
                    <span className="font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Generate Modal ───────────────────────────────────────────────────────────
function GenerateModal({ onClose, onGenerated }) {
    const [goal, setGoal] = useState('');
    const [weeks, setWeeks] = useState(4);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;
        setLoading(true);
        try {
            const res = await learningPathService.generate(goal.trim(), weeks);
            if (res.success) {
                toast.success('Learning path generated!');
                onGenerated(res.data);
                onClose();
            } else {
                toast.error(res.message || 'Failed to generate');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Generation failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="w-full max-w-lg bg-[#0F0529] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <Sparkles size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">New Learning Path</h2>
                        <p className="text-xs text-white/40">AI will build a multi-week curriculum for you</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Goal */}
                    <div>
                        <label className="block text-xs text-white/50 font-mono uppercase tracking-wider mb-2">
                            Your Goal
                        </label>
                        <div className="relative">
                            <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                placeholder="e.g. Master Data Structures, Learn React..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"
                                required
                                maxLength={200}
                            />
                        </div>
                    </div>

                    {/* Weeks */}
                    <div>
                        <label className="block text-xs text-white/50 font-mono uppercase tracking-wider mb-2">
                            Duration — <span className="text-cyan-400">{weeks} weeks</span>
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={12}
                            value={weeks}
                            onChange={e => setWeeks(Number(e.target.value))}
                            className="w-full h-2 rounded-full accent-cyan-500 cursor-pointer bg-white/10"
                        />
                        <div className="flex justify-between text-xs text-white/30 mt-1">
                            <span>1 week</span><span>12 weeks</span>
                        </div>
                    </div>

                    {/* Quick-pick goal chips */}
                    <div>
                        <p className="text-xs text-white/30 mb-2">Quick picks:</p>
                        <div className="flex flex-wrap gap-2">
                            {['Master Data Structures', 'Learn Machine Learning', 'Advanced JavaScript', 'System Design'].map(q => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setGoal(q)}
                                    className="px-3 py-1 text-xs rounded-full border border-white/10 text-white/50 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 text-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !goal.trim()}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin" /> Generating…</>
                            ) : (
                                <><Sparkles size={16} /> Generate Path</>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearningPath() {
    const [paths, setPaths] = useState([]);
    const [selectedPath, setSelectedPath] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingPaths, setLoadingPaths] = useState(true);

    useEffect(() => {
        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        setLoadingPaths(true);
        try {
            const res = await learningPathService.getAll();
            if (res.success) setPaths(res.data || []);
        } catch {
            toast.error('Failed to load learning paths');
        } finally {
            setLoadingPaths(false);
        }
    };

    const handleGenerated = (newPath) => {
        setPaths(prev => [newPath, ...prev]);
        setSelectedPath(newPath);
    };

    const handleDelete = async (id) => {
        try {
            await learningPathService.delete(id);
            setPaths(prev => prev.filter(p => p.id !== id));
            if (selectedPath?.id === id) setSelectedPath(null);
            toast.success('Path deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleToggleMilestone = async (pathId, week, day, completed) => {
        try {
            const res = await learningPathService.updateMilestone(pathId, week, day, completed);
            if (res.success) {
                const updated = res.data;
                setPaths(prev => prev.map(p => p.id === pathId ? updated : p));
                if (selectedPath?.id === pathId) setSelectedPath(updated);
            }
        } catch {
            toast.error('Failed to update milestone');
        }
    };

    // Overall progress for selected path
    const selectedTotalDays = selectedPath?.weeks?.reduce((s, w) => s + (w.days?.length || 0), 0) || 0;
    const selectedCompletedDays = selectedPath?.weeks?.reduce((s, w) => s + (w.days?.filter(d => d.completed).length || 0), 0) || 0;
    const selectedPct = selectedTotalDays > 0 ? Math.round((selectedCompletedDays / selectedTotalDays) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#030014] pb-32">
            {/* Hero header */}
            <div className="relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/10 to-transparent pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border border-cyan-500/30 flex items-center justify-center">
                                <MapPin size={20} className="text-cyan-400" />
                            </div>
                            <span className="text-xs font-mono text-cyan-400/70 uppercase tracking-widest">Neural Curriculum</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                            Learning <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Path Generator</span>
                        </h1>
                        <p className="text-white/50 max-w-xl text-sm">Input any goal and AI builds you a structured, multi-week curriculum — with daily flashcard, quiz, and summary milestones.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {selectedPath ? (
                    /* ── Detail View ── */
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Back + actions */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setSelectedPath(null)}
                                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
                            >
                                <LayoutList size={16} /> All Paths
                            </button>
                            <button
                                onClick={() => handleDelete(selectedPath.id)}
                                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>

                        {/* Path header card */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{selectedPath.goal}</h2>
                                    <p className="text-sm text-white/50 mb-3">{selectedPath.description}</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                                        <span className="flex items-center gap-1"><Calendar size={12} />{selectedPath.totalWeeks} weeks</span>
                                        <span className={`px-2 py-0.5 rounded-full border ${
                                            selectedPath.difficultyLevel === 'Beginner'     ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                                            selectedPath.difficultyLevel === 'Intermediate' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' :
                                                                                              'border-red-500/40 text-red-400 bg-red-500/10'
                                        }`}>{selectedPath.difficultyLevel}</span>
                                    </div>
                                </div>
                                {/* Big progress ring alternative — simple pill */}
                                <div className="text-right">
                                    <div className="text-3xl font-extrabold font-mono text-white">{selectedPct}<span className="text-lg text-white/40">%</span></div>
                                    <div className="text-xs text-white/40">{selectedCompletedDays}/{selectedTotalDays} days done</div>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                                    animate={{ width: `${selectedPct}%` }}
                                    transition={{ duration: 0.6 }}
                                />
                            </div>
                        </div>

                        {/* Weeks */}
                        <div className="space-y-3">
                            {selectedPath.weeks?.map(week => (
                                <WeekAccordion
                                    key={week.weekNumber}
                                    week={week}
                                    pathId={selectedPath.id}
                                    onToggleMilestone={handleToggleMilestone}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* ── List View ── */
                    <div>
                        {/* New path button */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">
                                {paths.length === 0 ? 'No paths yet' : `Your Paths (${paths.length})`}
                            </h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
                            >
                                <Plus size={16} />
                                New Path
                            </button>
                        </div>

                        {loadingPaths ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 size={28} className="animate-spin text-cyan-400" />
                            </div>
                        ) : paths.length === 0 ? (
                            /* Empty state */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-24 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-6">
                                    <GraduationCap size={36} className="text-white/20" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Generate your first path</h3>
                                <p className="text-sm text-white/40 max-w-xs mb-6">Tell the AI your learning goal and it'll craft a complete multi-week curriculum automatically.</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
                                >
                                    <Sparkles size={16} />
                                    Get Started
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div layout className="grid sm:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {paths.map(path => (
                                        <PathCard
                                            key={path.id}
                                            path={path}
                                            onSelect={setSelectedPath}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Generate Modal */}
            <AnimatePresence>
                {showModal && (
                    <GenerateModal
                        onClose={() => setShowModal(false)}
                        onGenerated={handleGenerated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
