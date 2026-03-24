import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../utils/api';
import { BrainCircuit, Loader2, CheckCircle2, AlertCircle, ArrowRight, Play, ArrowLeft } from 'lucide-react';
import { ScrambleText } from '../components/ui/ScrambleText';
import { TiltCard } from '../components/ui/TiltCard';

const QuizGenerator = () => {
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim() || isLoading) return;

        setIsLoading(true);
        setQuiz(null);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);

        try {
            const response = await quizAPI.generate(topic, questionCount);
            setQuiz(response.data);
        } catch (error) {
            console.error('Error generating quiz:', error);
            // alert('Failed to generate quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAnswer = (questionIndex, answerIndex) => {
        if (showResults) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleSubmitQuiz = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let correct = 0;
        quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswerIndex) {
                correct++;
            }
        });
        return correct;
    };

    const resetQuiz = () => {
        setQuiz(null);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
    };

    return (
        <div className="min-h-screen bg-void-base text-white p-4 md:p-8 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse-fast" />
                        <span className="text-xs font-mono text-pink-500 tracking-widest">COGNITIVE_MODULE // ACTIVE</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold"><ScrambleText text="QUIZ GENERATOR" /></h1>
                </div>
                <BrainCircuit className="text-white/20" size={32} />
            </div>


            {!quiz ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl"
                >
                    <form onSubmit={handleGenerate} className="bg-glass-base backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wide">Knowledge Domain</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Astrophysics, Ancient History..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all font-display tracking-wide"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-mono text-white/40 uppercase tracking-wide">Complexity Depth</label>
                                    <span className="text-xs font-mono text-pink-500">{questionCount} Qs</span>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="10"
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono font-bold tracking-widest rounded-xl hover:bg-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                                {isLoading ? 'COMPILING DATA...' : 'INITIATE ASSESSMENT'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    {!showResults ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-3xl"
                        >
                            <TiltCard className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-display font-bold text-white/20">0{currentQuestion + 1}</span>
                                        <div className="h-8 w-[1px] bg-white/10" />
                                        <span className="text-sm font-mono text-white/40 uppercase">Question Node</span>
                                    </div>
                                    <div className="text-xs font-mono text-pink-500">
                                        REMAINING: {quiz.questions.length - currentQuestion - 1}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-display font-medium leading-relaxed mb-8 relative z-10">
                                    {quiz.questions[currentQuestion].question}
                                </h3>

                                <div className="grid grid-cols-1 gap-4 mb-8 relative z-10">
                                    {quiz.questions[currentQuestion].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectAnswer(currentQuestion, index)}
                                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${selectedAnswers[currentQuestion] === index
                                                    ? 'bg-pink-500/10 border-pink-500/50 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 hover:text-white'
                                                }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono border ${selectedAnswers[currentQuestion] === index ? 'border-pink-500/50 bg-pink-500/20 text-pink-300' : 'border-white/10 bg-white/5 text-white/30'
                                                }`}>
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center relative z-10">
                                    <button
                                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestion === 0}
                                        className="text-white/30 hover:text-white disabled:opacity-0 flex items-center gap-2 text-sm font-mono uppercase"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>

                                    {currentQuestion === quiz.questions.length - 1 ? (
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                                            className="bg-pink-500 text-black px-8 py-3 rounded-xl font-bold font-mono tracking-widest hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                                        >
                                            FINALIZE
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                            className="bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-mono text-sm uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center gap-2"
                                        >
                                            Next Node <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute top-0 left-0 h-1 bg-pink-500/30 transition-all duration-300" style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }} />
                            </TiltCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-50 pointer-events-none" />

                                <h2 className="text-3xl font-display font-bold mb-2">ASSESSMENT COMPLETE</h2>
                                <p className="text-white/40 text-sm font-mono mb-8">Accuracy Calculation Finalized</p>

                                <div className="inline-flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-pink-500/30 bg-black/20 relative mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin-slow opacity-50" />
                                    <span className="text-5xl font-display font-bold text-white mb-1">{calculateScore()}</span>
                                    <span className="text-xs font-mono text-white/40">/ {quiz.questions.length}</span>
                                </div>

                                <button onClick={resetQuiz} className="bg-white/5 border border-white/10 text-pink-300 px-6 py-3 rounded-xl font-mono text-sm hover:bg-white/10 transition-colors">
                                    RE-INITIALIZE TEST
                                </button>
                            </div>

                            <div className="space-y-4">
                                {quiz.questions.map((q, index) => (
                                    <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`mt-1 p-1 rounded-full ${q.correctAnswerIndex === selectedAnswers[index] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {q.correctAnswerIndex === selectedAnswers[index] ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            </div>
                                            <p className="font-medium text-white/90">{q.question}</p>
                                        </div>

                                        <div className="space-y-2 pl-10 text-sm">
                                            {q.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border flex justify-between items-center ${optIndex === q.correctAnswerIndex
                                                            ? 'bg-green-500/10 border-green-500/30 text-green-200'
                                                            : selectedAnswers[index] === optIndex
                                                                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                                                                : 'border-transparent text-white/40'
                                                        }`}
                                                >
                                                    {option}
                                                    {optIndex === q.correctAnswerIndex && <span className="text-[10px] font-mono uppercase bg-green-500/20 px-2 py-0.5 rounded">Correct</span>}
                                                </div>
                                            ))}
                                            <p className="text-xs text-white/40 italic mt-2 border-l-2 border-white/10 pl-3 py-1">
                                                Observation: {q.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default QuizGenerator;
