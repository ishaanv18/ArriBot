import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import SignIn from './pages/SignIn';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import ChatBot from './pages/ChatBot';
import Flashcards from './pages/Flashcards';
import QuizGenerator from './pages/QuizGenerator';
import Summarization from './pages/Summarization';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

function App() {
    return (

        <AuthProvider>
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Redirect Legacy Routes */}
                    <Route path="/signin" element={<Auth />} />
                    <Route path="/signup" element={<Auth />} />

                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/contact" element={<ContactUs />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                        <ProtectedRoute>
                            <ChatBot />
                        </ProtectedRoute>
                    } />
                    <Route path="/flashcards" element={
                        <ProtectedRoute>
                            <Flashcards />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz" element={
                        <ProtectedRoute>
                            <QuizGenerator />
                        </ProtectedRoute>
                    } />
                    <Route path="/summarize" element={
                        <ProtectedRoute>
                            <Summarization />
                        </ProtectedRoute>
                    } />
                    <Route path="/resume" element={
                        <ProtectedRoute>
                            <ResumeAnalyzer />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default App;

