import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-20 animated-bg"></div>

            {/* Particle Background */}
            <ParticleBackground particleCount={60} particleColor="#9333ea" particleSize={4} speed={0.4} />

            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass rounded-2xl shadow-2xl p-8 mb-8 relative z-10 overflow-hidden"
                >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 gradient-shift"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
                        <div>
                            <motion.h1
                                className="text-4xl font-bold mb-2 leading-tight"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <span className="gradient-text">
                                    {getGreeting()}, {user?.fullName}!
                                </span>
                                <motion.span
                                    className="inline-block ml-2"
                                    animate={{
                                        rotate: [0, 14, -8, 14, -4, 10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                    }}
                                >
                                    👋
                                </motion.span>
                            </motion.h1>
                            <motion.p
                                className="text-gray-600 text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                Welcome back to your learning dashboard
                            </motion.p>
                        </div>
                        <motion.div
                            className="mt-4 md:mt-0"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <div className="glass rounded-xl p-4 text-center glow-pulse">
                                <motion.div
                                    className="text-3xl font-bold text-purple-600"
                                    key={currentTime.getSeconds()}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {currentTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </motion.div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {[
                        { icon: '🎯', value: '4', label: 'AI Tools Available' },
                        { icon: '⚡', value: 'Ready', label: 'System Status' },
                        { icon: '🚀', value: 'Unlimited', label: 'Learning Potential' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
                                scale: 1.05
                            }}
                            className="glass rounded-xl p-6 text-center hover-lift cursor-pointer"
                        >
                            <motion.div
                                className="text-4xl mb-2"
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: index * 0.3
                                }}
                            >
                                {stat.icon}
                            </motion.div>
                            <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div>
                    <motion.h2
                        className="text-2xl font-bold text-gray-800 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Your <span className="gradient-text">AI Tools</span>
                    </motion.h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.path}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.03,
                                    y: -8,
                                    rotateX: 5,
                                    rotateY: 5
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(feature.path)}
                                className="glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Animated gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <motion.div
                                            className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg`}
                                            whileHover={{
                                                rotate: [0, -10, 10, -10, 0],
                                                scale: 1.2
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <motion.div
                                            className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 animated-underline">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Ripple effect on click */}
                                <div className="absolute inset-0 ripple-effect"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Quick Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="glass rounded-2xl p-6 mt-8 relative overflow-hidden"
                >
                    {/* Animated background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

                    <div className="relative z-10">
                        <motion.h3
                            className="text-xl font-bold text-gray-800 mb-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            <motion.span
                                animate={{ rotate: [0, 20, -20, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="inline-block mr-2"
                            >
                                💡
                            </motion.span>
                            Quick Tips
                        </motion.h3>
                        <ul className="space-y-2 text-gray-600">
                            {[
                                'Start with the ChatBot to get familiar with AI-powered assistance',
                                'Use Flashcards to create study materials for any topic',
                                'Generate quizzes to test your understanding',
                                'Summarize long articles or documents to save time'
                            ].map((tip, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                                    whileHover={{ x: 5, color: '#9333ea' }}
                                >
                                    <span className="text-purple-600 mr-2">•</span>
                                    <span>{tip}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

