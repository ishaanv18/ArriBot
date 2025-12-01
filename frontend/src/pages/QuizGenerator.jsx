import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../utils/api';

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
            alert('Failed to generate quiz. Please try again.');
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
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Quiz Generator
                </h1>
                <p className="text-gray-600 text-lg">
                    Test your knowledge with AI-generated quizzes
                </p>
            </motion.div>

            {!quiz ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-8"
                >
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Quiz Topic
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Python Programming, Ancient Rome, Biology"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Number of Questions: {questionCount}
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>3</span>
                                <span>10</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <div className="spinner mr-2"></div>
                                    Generating Quiz...
                                </span>
                            ) : (
                                'Generate Quiz'
                            )}
                        </button>
                    </form>
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    {!showResults ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass rounded-2xl p-8"
                        >
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Question {currentQuestion + 1} of {quiz.questions.length}
                                    </h2>
                                    <button
                                        onClick={resetQuiz}
                                        className="text-purple-600 hover:text-purple-800 font-semibold"
                                    >
                                        New Quiz
                                    </button>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-2">
                                    <div
                                        className="gradient-purple h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                    {quiz.questions[currentQuestion].question}
                                </h3>
                                <div className="space-y-3">
                                    {quiz.questions[currentQuestion].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectAnswer(currentQuestion, index)}
                                            className={`quiz-option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''
                                                }`}
                                        >
                                            <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestion === 0}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {currentQuestion === quiz.questions.length - 1 ? (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                        className="btn-primary"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass rounded-2xl p-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Results</h2>
                                <div className="inline-block gradient-purple text-white rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold shadow-xl">
                                    {calculateScore()}/{quiz.questions.length}
                                </div>
                                <p className="text-xl text-gray-600 mt-4">
                                    You got {calculateScore()} out of {quiz.questions.length} correct!
                                </p>
                            </div>

                            <div className="space-y-6 mb-8">
                                {quiz.questions.map((q, index) => (
                                    <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                                        <p className="font-semibold mb-2">{q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-2 rounded ${optIndex === q.correctAnswerIndex
                                                            ? 'bg-green-100 border border-green-500'
                                                            : selectedAnswers[index] === optIndex
                                                                ? 'bg-red-100 border border-red-500'
                                                                : 'bg-gray-50'
                                                        }`}
                                                >
                                                    {option}
                                                    {optIndex === q.correctAnswerIndex && ' ✓'}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 italic">{q.explanation}</p>
                                    </div>
                                ))}
                            </div>

                            <button onClick={resetQuiz} className="btn-primary w-full">
                                Take Another Quiz
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default QuizGenerator;
