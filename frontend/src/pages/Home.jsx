import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import logo from '../assets/arribot-logo-new.png';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
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

    const cardHoverVariants = {
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-20 animated-bg"></div>

            {/* Particle Background */}
            <ParticleBackground particleCount={80} particleColor="#9333ea" particleSize={4} speed={0.5} />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center mb-16 relative"
            >
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.2,
                        duration: 0.8
                    }}
                    className="inline-block mb-6"
                >
                    <motion.div
                        className="w-32 h-32 flex items-center justify-center"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <img
                            src={logo}
                            alt="ArriBot"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </motion.div>
                </motion.div>

                {/* Main Heading with Shimmer Effect */}
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <span className="gradient-text">
                        Welcome to ArriBot
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Your AI-powered learning companion for{' '}
                    <span className="font-semibold text-purple-600">smarter studying</span>,{' '}
                    <span className="font-semibold text-purple-600">instant knowledge</span>, and{' '}
                    <span className="font-semibold text-purple-600">accelerated learning</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {!isAuthenticated ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="btn-primary px-8 py-4 text-lg ripple-effect glow-pulse"
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
                            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary px-8 py-4 text-lg ripple-effect"
                        >
                            Go to Dashboard 📊
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{
                            y: -5,
                            boxShadow: '0 20px 40px rgba(147, 51, 234, 0.2)'
                        }}
                        className="glass rounded-xl p-6 text-center hover-lift"
                    >
                        <div className="text-4xl mb-2">
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Features Section */}
            <div className="mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">
                        Powerful AI Tools at Your{' '}
                        <span className="gradient-text">Fingertips</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to accelerate your learning journey, powered by cutting-edge AI technology
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <Link to={isAuthenticated ? feature.path : '/signup'}>
                                <motion.div
                                    className="card p-8 h-full hover:border-purple-300 group relative overflow-hidden"
                                    variants={cardHoverVariants}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <motion.div
                                            className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}
                                            whileHover={{
                                                rotate: [0, -10, 10, -10, 0],
                                                scale: 1.1
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors animated-underline">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {feature.description}
                                        </p>
                                        <motion.div
                                            className="flex items-center text-purple-600 font-semibold"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                        >
                                            {isAuthenticated ? 'Try it now' : 'Sign up to access'}
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* How It Works Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    How It <span className="gradient-text">Works</span>
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
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            whileHover={{ y: -10 }}
                            className="text-center"
                        >
                            <motion.div
                                className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg"
                                whileHover={{
                                    scale: 1.2,
                                    rotate: 360,
                                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.5)'
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                {item.step}
                            </motion.div>
                            <div className="text-4xl mb-3">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Why Choose ArriBot Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    Why Choose <span className="gradient-text">ArriBot</span>?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '🚀',
                            title: 'Lightning Fast',
                            description: 'Get instant responses powered by Gemini 2.0 Flash, the fastest AI model available'
                        },
                        {
                            icon: '🎯',
                            title: 'Highly Accurate',
                            description: 'Advanced AI ensures precise answers and high-quality study materials every time'
                        },
                        {
                            icon: '🔒',
                            title: 'Secure & Private',
                            description: 'Your data is encrypted and protected. We never share your information'
                        },
                        {
                            icon: '💡',
                            title: 'Smart Learning',
                            description: 'Adaptive AI that learns your style and provides personalized recommendations'
                        },
                        {
                            icon: '📱',
                            title: 'Mobile Friendly',
                            description: 'Study anywhere, anytime with our fully responsive design'
                        },
                        {
                            icon: '🆓',
                            title: 'Completely Free',
                            description: 'All features available at no cost. No hidden fees, no premium tiers'
                        }
                    ].map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass rounded-xl p-6 hover-lift"
                        >
                            <div className="text-5xl mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Use Cases Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">
                    Perfect for <span className="gradient-text">Everyone</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
                    Whether you're a student, professional, or lifelong learner, ArriBot adapts to your needs
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            title: 'Students',
                            icon: '🎓',
                            description: 'Ace your exams with AI-generated study materials, practice quizzes, and instant homework help',
                            features: ['Exam preparation', 'Homework assistance', 'Study guides', 'Practice tests']
                        },
                        {
                            title: 'Professionals',
                            icon: '💼',
                            description: 'Stay ahead in your career with quick research, document summaries, and skill development',
                            features: ['Research assistance', 'Document analysis', 'Skill learning', 'Quick references']
                        },
                        {
                            title: 'Educators',
                            icon: '👨‍🏫',
                            description: 'Create engaging lesson materials, quizzes, and educational content in minutes',
                            features: ['Lesson planning', 'Quiz creation', 'Content generation', 'Assessment tools']
                        },
                        {
                            title: 'Lifelong Learners',
                            icon: '📖',
                            description: 'Explore new topics, master new skills, and satisfy your curiosity with AI guidance',
                            features: ['Topic exploration', 'Skill mastery', 'Knowledge expansion', 'Self-paced learning']
                        }
                    ].map((useCase, index) => (
                        <motion.div
                            key={useCase.title}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="card p-8 hover:border-purple-300"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-5xl">
                                    {useCase.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{useCase.title}</h3>
                                    <p className="text-gray-600 mb-4">{useCase.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {useCase.features.map((feature, idx) => (
                                    <motion.span
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                    >
                                        {feature}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Key Features Deep Dive */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    Powerful <span className="gradient-text">Features</span>
                </h2>
                <div className="space-y-8">
                    {[
                        {
                            title: 'AI ChatBot - Your 24/7 Study Companion',
                            icon: '💬',
                            gradient: 'from-purple-500 to-purple-700',
                            points: [
                                'Ask any question and get instant, accurate answers',
                                'Explain complex concepts in simple terms',
                                'Get step-by-step solutions to problems',
                                'Available 24/7, never takes a break'
                            ]
                        },
                        {
                            title: 'Flashcards Generator - Master Any Topic',
                            icon: '📚',
                            gradient: 'from-pink-500 to-pink-700',
                            points: [
                                'Generate custom flashcards on any subject',
                                'Interactive flip animations for engaging study',
                                'Perfect for memorization and quick review',
                                'Export and share with classmates'
                            ]
                        },
                        {
                            title: 'Quiz Generator - Test Your Knowledge',
                            icon: '📝',
                            gradient: 'from-blue-500 to-blue-700',
                            points: [
                                'Create practice quizzes instantly',
                                'Multiple choice, true/false, and more',
                                'Immediate feedback on your answers',
                                'Track your progress over time'
                            ]
                        },
                        {
                            title: 'Text Summarizer - Save Time',
                            icon: '📄',
                            gradient: 'from-green-500 to-green-700',
                            points: [
                                'Summarize long articles in seconds',
                                'Extract key points from documents',
                                'Perfect for research and studying',
                                'Adjustable summary length'
                            ]
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="glass rounded-2xl p-8 hover:border-purple-300 group"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <motion.div
                                    className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 animated-underline">
                                        {feature.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {feature.points.map((point, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                                className="flex items-start gap-3 text-gray-600"
                                            >
                                                <span className="text-purple-600 mt-1">✓</span>
                                                <span>{point}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <div className="card-purple p-12 rounded-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        Trusted by Learners Worldwide
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '50K+', label: 'Questions Answered' },
                            { value: '25K+', label: 'Flashcards Created' },
                            { value: '99%', label: 'Satisfaction Rate' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    Frequently Asked <span className="gradient-text">Questions</span>
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            q: 'Is ArriBot really free?',
                            a: 'Yes! ArriBot is completely free to use. All features are available at no cost with no hidden fees or premium tiers.'
                        },
                        {
                            q: 'What AI model powers ArriBot?',
                            a: 'ArriBot is powered by Google\'s Gemini 2.0 Flash, one of the most advanced and fastest AI models available.'
                        },
                        {
                            q: 'Can I use ArriBot for homework help?',
                            a: 'Absolutely! ArriBot is perfect for homework assistance, explaining concepts, and providing study guidance.'
                        },
                        {
                            q: 'Is my data secure?',
                            a: 'Yes, we take security seriously. All data is encrypted and we never share your information with third parties.'
                        },
                        {
                            q: 'Do I need to download anything?',
                            a: 'No! ArriBot is a web application that works directly in your browser. Just sign up and start learning.'
                        }
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-xl p-6 hover:border-purple-300"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                <span className="text-purple-600 mr-2">Q:</span>
                                {faq.q}
                            </h3>
                            <p className="text-gray-600 ml-6">
                                <span className="text-purple-600 mr-2">A:</span>
                                {faq.a}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Final CTA Section */}
            {!isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="card-purple p-12 text-center rounded-3xl relative overflow-hidden"
                >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -30, 0],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to supercharge your learning?
                        </h2>
                        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                            Join thousands of learners using AI to study smarter, not harder. Get started for free today!
                        </p>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/signup')}
                            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ripple-effect"
                        >
                            Create Free Account →
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;




