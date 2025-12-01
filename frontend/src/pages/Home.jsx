import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/arribot-logo.png';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const features = [
        {
            title: 'AI ChatBot',
            description: 'Get instant answers to your coding and learning questions with our intelligent chatbot powered by Gemini 2.0',
            icon: '💬',
            path: '/chat',
            gradient: 'from-purple-500 to-purple-700',
        },
        {
            title: 'Flashcards Generator',
            description: 'Generate custom flashcards on any topic to enhance your learning experience and boost retention',
            icon: '📚',
            path: '/flashcards',
            gradient: 'from-pink-500 to-pink-700',
        },
        {
            title: 'Quiz Generator',
            description: 'Create interactive quizzes to test your knowledge and track your progress with AI-generated questions',
            icon: '📝',
            path: '/quiz',
            gradient: 'from-blue-500 to-blue-700',
        },
        {
            title: 'Text Summarizer',
            description: 'Summarize long articles and documents into concise, easy-to-understand summaries in seconds',
            icon: '📄',
            path: '/summarize',
            gradient: 'from-green-500 to-green-700',
        },
    ];

    const stats = [
        { icon: '🤖', value: 'AI-Powered', label: 'Gemini 2.0 Flash' },
        { icon: '⚡', value: 'Instant', label: 'Real-time Responses' },
        { icon: '🎯', value: '4 Tools', label: 'Learning Features' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="inline-block mb-6"
                >
                    <div className="w-32 h-32 flex items-center justify-center animate-float-slow">
                        <img src={logo} alt="ArriBot" className="w-full h-full object-contain" />
                    </div>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-tight">
                    Welcome to ArriBot
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                    Your AI-powered learning companion for smarter studying, instant knowledge, and accelerated learning
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {!isAuthenticated ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="btn-primary px-8 py-4 text-lg"
                            >
                                Get Started Free 🚀
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signin')}
                                className="btn-secondary px-8 py-4 text-lg"
                            >
                                Sign In
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary px-8 py-4 text-lg"
                        >
                            Go to Dashboard 📊
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="glass rounded-xl p-6 text-center"
                    >
                        <div className="text-4xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Features Section */}
            <div className="mb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">
                        Powerful AI Tools at Your Fingertips
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to accelerate your learning journey, powered by cutting-edge AI technology
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            <Link to={isAuthenticated ? feature.path : '/signup'}>
                                <div className="card p-8 h-full hover:border-purple-300 group relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {feature.description}
                                        </p>
                                        <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                            {isAuthenticated ? 'Try it now' : 'Sign up to access'}
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* How It Works Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds', icon: '📝' },
                        { step: '2', title: 'Choose a Tool', desc: 'Select from our AI-powered features', icon: '🎯' },
                        { step: '3', title: 'Start Learning', desc: 'Get instant AI assistance', icon: '🚀' }
                    ].map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg">
                                {item.step}
                            </div>
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Final CTA Section */}
            {!isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="card-purple p-12 text-center rounded-3xl"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to supercharge your learning?
                    </h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Join thousands of learners using AI to study smarter, not harder. Get started for free today!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/signup')}
                        className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        Create Free Account →
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default Home;
