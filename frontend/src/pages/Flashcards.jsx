import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flashcardsAPI } from '../utils/api';

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
        setFlashcards([]);
        setFlippedCards(new Set());

        try {
            const response = await flashcardsAPI.generate(topic, count);
            setFlashcards(response.data);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('Failed to generate flashcards. Please try again.');
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
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Flashcards Generator
                </h1>
                <p className="text-gray-600 text-lg">
                    Generate custom flashcards on any topic to boost your learning
                </p>
            </motion.div>

            {/* Input Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8 mb-8"
            >
                <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., JavaScript Promises, World War II, Photosynthesis"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Number of Flashcards: {count}
                        </label>
                        <input
                            type="range"
                            min="3"
                            max="10"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
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
                                Generating...
                            </span>
                        ) : (
                            'Generate Flashcards'
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Flashcards Display */}
            <AnimatePresence>
                {flashcards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {flashcards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flashcard ${flippedCards.has(index) ? 'flipped' : ''}`}
                                onClick={() => toggleFlip(index)}
                            >
                                <div className="flashcard-inner">
                                    <div className="flashcard-front">
                                        <div className="text-sm font-semibold mb-2 opacity-80">Question</div>
                                        <p className="text-lg font-medium">{card.question}</p>
                                        <div className="absolute bottom-4 right-4 text-sm opacity-60">
                                            Click to flip
                                        </div>
                                    </div>
                                    <div className="flashcard-back">
                                        <div className="text-sm font-semibold mb-2 text-purple-600">Answer</div>
                                        <p className="text-lg">{card.answer}</p>
                                        <div className="absolute bottom-4 right-4 text-sm text-purple-600 opacity-60">
                                            Click to flip
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Flashcards;
