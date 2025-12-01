import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const features = [
        {
            title: 'AI ChatBot',
            icon: '💬',
            description: 'Get instant answers to your questions',
            path: '/chat',
            gradient: 'from-purple-500 to-purple-700'
        },
        {
            title: 'Flashcards',
            icon: '📚',
            description: 'Create and study custom flashcards',
            path: '/flashcards',
            gradient: 'from-pink-500 to-pink-700'
        },
        {
            title: 'Quiz Generator',
            icon: '📝',
            description: 'Test your knowledge with AI quizzes',
            path: '/quiz',
            gradient: 'from-blue-500 to-blue-700'
        },
        {
            title: 'Summarize',
            icon: '📄',
            description: 'Summarize long texts instantly',
            path: '/summarize',
            gradient: 'from-green-500 to-green-700'
        }
    ];

    return (
        <div className="min-h-screen animated-bg py-12 px-4">
            {/* Floating background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-fast"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl shadow-2xl p-8 mb-8 relative z-10"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                {getGreeting()}, {user?.fullName}! 👋
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Welcome back to your learning dashboard
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {currentTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="glass rounded-xl p-6 text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <div className="text-2xl font-bold text-purple-600">4</div>
                        <div className="text-gray-600">AI Tools Available</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center">
                        <div className="text-4xl mb-2">⚡</div>
                        <div className="text-2xl font-bold text-purple-600">Ready</div>
                        <div className="text-gray-600">System Status</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center">
                        <div className="text-4xl mb-2">🚀</div>
                        <div className="text-2xl font-bold text-purple-600">Unlimited</div>
                        <div className="text-gray-600">Learning Potential</div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your AI Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.path}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => navigate(feature.path)}
                                className="glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            →
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass rounded-2xl p-6 mt-8"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Quick Tips</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Start with the ChatBot to get familiar with AI-powered assistance</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Use Flashcards to create study materials for any topic</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Generate quizzes to test your understanding</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>Summarize long articles or documents to save time</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
