import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Trash2, Search, BrainCircuit, AlertCircle, CheckCircle, ArrowRight, Loader, Target, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { TiltCard } from '../components/ui/TiltCard';
import { ScrambleText } from '../components/ui/ScrambleText';
import resumeService from '../services/resumeService';

export default function ResumeAnalyzer() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [targetRole, setTargetRole] = useState('Software Engineer');
    const [showRoleInput, setShowRoleInput] = useState(false);

    // Fetch resumes on mount
    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const data = await resumeService.getUserResumes();
            if (data.success) {
                setResumes(data.resumes);
            }
        } catch (error) {
            console.error("Failed to fetch resumes", error);
            toast.error("Failed to load data archives");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error("Invalid Format. Only PDF data streams accepted.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading to Neural Link...");

        try {
            const data = await resumeService.uploadResume(file);
            if (data.success) {
                toast.success("Upload Complete", { id: toastId });
                fetchResumes();
            } else {
                toast.error(data.message || "Upload Failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Transmission Error", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Purge this data record?")) return;

        try {
            await resumeService.deleteResume(id);
            toast.success("Record Purged");
            setResumes(prev => prev.filter(r => r.id !== id));
            if (selectedResume?.id === id) {
                setSelectedResume(null);
                setAnalysisResult(null);
            }
        } catch (error) {
            toast.error("Purge Failed");
        }
    };

    const handleAnalyze = async (resume) => {
        setSelectedResume(resume);
        setAnalysisResult(null);
        setShowRoleInput(true);
    };

    const startAnalysis = async () => {
        if (!selectedResume) return;

        setAnalyzingId(selectedResume.id);
        setShowRoleInput(false);

        try {
            // Check if analysis exists first
            try {
                const existing = await resumeService.getAnalysis(selectedResume.id);
                if (existing.success && existing.analysis.targetRole === targetRole) {
                    setAnalysisResult(existing.analysis);
                    setAnalyzingId(null);
                    return;
                }
            } catch (ignore) {
                // No existing analysis, proceed to generate
            }

            // Generate new analysis
            const data = await resumeService.analyzeResume(selectedResume.id, targetRole);
            if (data.success) {
                setAnalysisResult(data.analysis);
                toast.success("Analysis Complete");
            }
        } catch (error) {
            console.error(error);
            toast.error("Analysis Failed");
        } finally {
            setAnalyzingId(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const QualityBar = ({ label, score, color }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-white/60 uppercase">{label}</span>
                <span className="text-sm font-display font-bold" style={{ color }}>{score}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-void-base text-white p-6 pb-24 md:p-12">

            {/* Header */}
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-xs font-mono text-violet-400 tracking-widest">CAREER_OPTIMIZATION // MODULE_ACTIVE</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold">
                    <ScrambleText text="RESUME ANALYZER" />
                </h1>
                <p className="text-white/60 mt-2 max-w-2xl">
                    Upload your data crystal (PDF) to analyze skill patterns, detect gaps, and generate optimized learning paths.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Panel: Upload & List */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Upload Zone */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer bg-black/40 hover:bg-white/5 transition-all overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader className="animate-spin text-cyan-400" size={32} />
                                    <span className="text-xs font-mono text-cyan-400 animate-pulse">UPLOADING...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="text-white/40 group-hover:text-cyan-400 transition-colors" size={32} />
                                    <p className="font-mono text-sm text-white/60">DROP PDF DATALINK HERE</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                    </div>

                    {/* Resume List */}
                    <div className="space-y-3">
                        <h3 className="font-display text-lg text-white/80">DATA ARCHIVES</h3>
                        {resumes.length === 0 && !isLoading ? (
                            <p className="text-white/30 text-sm font-mono italic">No archives found.</p>
                        ) : (
                            resumes.map(resume => (
                                <motion.div
                                    key={resume.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${selectedResume?.id === resume.id
                                        ? 'bg-white/10 border-cyan-500/50'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                    onClick={() => handleAnalyze(resume)}
                                >
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${selectedResume?.id === resume.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm truncate max-w-[150px]">{resume.fileName}</h4>
                                                <p className="text-xs text-white/40 font-mono">{formatDate(resume.uploadedAt)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(resume.id, e)}
                                            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/20 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {/* Progress line if analyzing */}
                                    {analyzingId === resume.id && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-cyan-400"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Analysis Results */}
                <div className="lg:col-span-8">
                    {!selectedResume ? (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-white/20 border border-white/5 rounded-3xl bg-black/20">
                            <BrainCircuit size={64} className="mb-4 opacity-50" />
                            <p className="font-mono text-sm">SELECT A DATA ARCHIVE TO INITIATE ANALYSIS</p>
                        </div>
                    ) : showRoleInput ? (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-violet-500/20 rounded-3xl bg-black/20 p-8">
                            <Target size={48} className="text-violet-400 mb-6" />
                            <h3 className="text-2xl font-display mb-6">Configure Analysis Parameters</h3>

                            <div className="w-full max-w-md space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-white/60 uppercase mb-2">Target Role</label>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g., Software Engineer, Data Scientist"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-display"
                                    />
                                </div>

                                <button
                                    onClick={startAnalysis}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white font-display py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group"
                                >
                                    <BrainCircuit size={20} />
                                    INITIATE ANALYSIS
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ) : analyzingId === selectedResume.id ? (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-cyan-500/20 rounded-3xl bg-black/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                            <Loader size={48} className="text-cyan-400 animate-spin mb-4" />
                            <ScrambleText text="ANALYZING NEURAL PATTERNS..." className="font-mono text-cyan-400" />
                            <p className="text-xs text-white/40 mt-2 font-mono">EXTRACTING SKILLS // DETECTING GAPS</p>
                        </div>
                    ) : analysisResult ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Quality Scores Section */}
                            <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-display mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-violet-500 rounded-full" />
                                    QUALITY METRICS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <QualityBar label="Overall Score" score={analysisResult.overallScore || 0} color="#a78bfa" />
                                    <QualityBar label="Skill Match" score={analysisResult.skillMatchScore || 0} color="#22d3ee" />
                                    <QualityBar label="Experience Level" score={analysisResult.experienceScore || 0} color="#34d399" />
                                    <QualityBar label="Resume Quality" score={analysisResult.resumeQualityScore || 0} color="#fb923c" />
                                </div>
                            </div>

                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TiltCard className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-xs font-mono text-white/40 uppercase mb-1">Experience Level</div>
                                    <div className="text-2xl font-display font-medium text-cyan-400">{analysisResult.experienceYears} Years</div>
                                </TiltCard>
                                <TiltCard className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-xs font-mono text-white/40 uppercase mb-1">Skills Detected</div>
                                    <div className="text-2xl font-display font-medium text-emerald-400">{analysisResult.detectedSkills?.length || 0}</div>
                                </TiltCard>
                                <TiltCard className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-xs font-mono text-white/40 uppercase mb-1">Gap Detected</div>
                                    <div className="text-2xl font-display font-medium text-rose-400">{analysisResult.missingSkills?.length || 0}</div>
                                </TiltCard>
                            </div>

                            {/* Skills Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Detected Skills */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="flex items-center gap-2 text-lg font-display mb-4">
                                        <CheckCircle size={18} className="text-emerald-400" />
                                        DETECTED SKILLS
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.detectedSkills?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="flex items-center gap-2 text-lg font-display mb-4">
                                        <AlertCircle size={18} className="text-rose-400" />
                                        CRITICAL GAPS
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.missingSkills?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Learning Path */}
                            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400">
                                    <BrainCircuit size={100} />
                                </div>
                                <h3 className="text-xl font-display mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-cyan-500 rounded-full" />
                                    OPTIMIZED LEARNING PATH
                                </h3>

                                <div className="space-y-6 relative z-10">
                                    {JSON.parse(analysisResult.learningPath || "[]").map((item, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 font-mono text-sm">
                                                {i + 1}
                                            </div>
                                            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex-1 hover:border-cyan-500/30 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{item.skill}</h4>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${item.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                                        }`}>
                                                        {item.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/60 mb-3">{item.reason}</p>

                                                <div className="flex gap-2 text-xs font-mono text-white/40">
                                                    <span>EST. TIME: {item.estimatedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
