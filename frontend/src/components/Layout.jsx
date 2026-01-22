import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FloatingDock } from './ui/FloatingDock';
import { SpotlightCursor } from './ui/SpotlightCursor';
import { Home, LayoutDashboard, MessageSquare, BookOpen, BrainCircuit, FileText, Mail, LogIn, User, Briefcase } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    // Define Navigation Items for the Floating Dock
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        ...(isAuthenticated ? [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/chat', label: 'AI Chat', icon: MessageSquare },
            { path: '/flashcards', label: 'Flashcards', icon: BookOpen },
            { path: '/quiz', label: 'Quiz', icon: BrainCircuit },
            { path: '/summarize', label: 'Summarizer', icon: FileText },
            { path: '/resume', label: 'Resume', icon: Briefcase },
        ] : [
            { path: '/auth', label: 'Sign In', icon: LogIn },
        ]),
        { path: '/contact', label: 'Contact', icon: Mail },
    ];

    return (
        <div className="min-h-screen relative text-white selection:bg-cyan-glow/30 selection:text-cyan-100">
            {/* 1. Global Effects */}
            <SpotlightCursor />

            {/* 2. Main Space */}
            <main className="relative z-10 min-h-screen flex flex-col">
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </main>

            {/* 3. Floating Dock Navigation (MacOS Style) */}
            <FloatingDock items={navItems} />

            {/* 4. User Status Indicator (Top Right) */}
            {isAuthenticated && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-fast" />
                    <span className="text-xs font-mono text-white/60">
                        OP: {user?.fullName?.split(' ')[0].toUpperCase()}
                    </span>
                    <User size={14} className="text-white/40" />
                </div>
            )}
        </div>
    );
};

export default Layout;
