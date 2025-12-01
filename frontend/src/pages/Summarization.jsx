import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { summaryAPI } from '../utils/api';

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
            alert('Failed to summarize text. Please try again.');
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
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Text Summarizer
                </h1>
                <p className="text-gray-600 text-lg">
                    Transform long paragraphs into concise, easy-to-understand summaries
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-2xl p-6"
                >
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Original Text</h2>
                    <form onSubmit={handleSummarize} className="space-y-4">
                        <div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste your text here to get a concise summary..."
                                className="input-field min-h-[300px] resize-none"
                                required
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>{wordCount} words</span>
                                <span>{inputText.length} characters</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={isLoading || !inputText.trim()}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="spinner mr-2"></div>
                                        Summarizing...
                                    </span>
                                ) : (
                                    'Summarize'
                                )}
                            </button>
                            {(inputText || summary) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn-secondary"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Summary Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-2xl p-6"
                >
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Summary</h2>

                    {!summary && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-center">Your summary will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-[300px]">
                            <div className="spinner mb-4"></div>
                            <p className="text-gray-600">Generating summary...</p>
                        </div>
                    )}

                    {summary && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-lg">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {summary.summarizedText}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white border border-purple-200 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Original</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {summary.originalText.trim().split(/\s+/).length} words
                                    </p>
                                </div>
                                <div className="bg-white border border-purple-200 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Summary</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {summary.summarizedText.trim().split(/\s+/).length} words
                                    </p>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                <p className="text-green-700 font-semibold">
                                    Reduced by {Math.round((1 - summary.summarizedText.trim().split(/\s+/).length / summary.originalText.trim().split(/\s+/).length) * 100)}%
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 card p-6"
            >
                <h3 className="text-xl font-bold mb-3 text-gray-800">💡 Tips for Best Results</h3>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>Paste well-structured text with clear paragraphs for better summaries</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>Longer texts (200+ words) typically produce more meaningful summaries</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>The AI focuses on key points and main ideas while preserving context</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
};

export default Summarization;
