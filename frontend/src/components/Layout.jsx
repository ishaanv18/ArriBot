import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/arribot-logo-new.png';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const publicNavItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/contact', label: 'Contact Us', icon: '📧' },
    ];

    const authNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/chat', label: 'ChatBot', icon: '💬' },
        { path: '/flashcards', label: 'Flashcards', icon: '📚' },
        { path: '/quiz', label: 'Quiz', icon: '📝' },
        { path: '/summarize', label: 'Summarize', icon: '📄' },
    ];

    const navItems = isAuthenticated ? authNavItems : publicNavItems;

    const handleLogout = () => {
        logout();
        toast.success('Successfully logged out!');
        navigate('/');
    };

    // Hide layout on auth pages
    const authPages = ['/signup', '/signin', '/verify-otp'];
    const isAuthPage = authPages.includes(location.pathname);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen animated-bg">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src={logo} alt="ArriBot" className="w-12 h-12 object-contain transform hover:scale-110 transition-transform duration-300" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                ArriBot
                            </h1>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${location.pathname === item.path
                                        ? 'gradient-purple text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-purple-100'
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}

                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/signin"
                                        className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-purple-100 transition-all duration-300"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn-primary"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3 ml-4">
                                    <div className="text-sm text-gray-700">
                                        Hi, <span className="font-semibold text-purple-600">{user?.fullName}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg transition-all duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-50">
                <div className="flex justify-around py-3">
                    {navItems.slice(0, 4).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${location.pathname === item.path
                                ? 'text-purple-600'
                                : 'text-gray-600'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 text-red-600"
                        >
                            <span className="text-2xl">🚪</span>
                            <span className="text-xs font-medium">Logout</span>
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                {/* Large blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow" style={{ animationDelay: '4s' }}></div>

                {/* Medium blobs */}
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow" style={{ animationDelay: '3s' }}></div>

                {/* Small particles */}
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-200 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float-fast"></div>
                <div className="absolute bottom-1/3 left-10 w-20 h-20 bg-green-200 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float-fast" style={{ animationDelay: '1.5s' }}></div>
            </div>
        </div>
    );
};

export default Layout;
