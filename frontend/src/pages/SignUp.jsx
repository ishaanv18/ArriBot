import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import logo from '../assets/arribot-logo.png';

const PasswordAnalyzer = ({ password }) => {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981'];

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i < strength ? strengthColors[strength] : '#e5e7eb'
                        }}
                    />
                ))}
            </div>
            <p className="text-sm" style={{ color: strengthColors[strength] }}>
                {password ? strengthLabels[strength] : 'Enter a password'}
            </p>
            {password && strength < 4 && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p>💡 Suggestions:</p>
                    {password.length < 8 && <p>• Use at least 8 characters</p>}
                    {!/[a-z]/.test(password) || !/[A-Z]/.test(password) ? <p>• Mix uppercase and lowercase</p> : null}
                    {!/\d/.test(password) && <p>• Include numbers</p>}
                    {!/[^a-zA-Z0-9]/.test(password) && <p>• Add special characters (!@#$%)</p>}
                </div>
            )}
        </div>
    );
};

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreed) {
            setError('Please accept the disclaimer to continue');
            return;
        }

        setLoading(true);

        try {
            console.log('Sending signup request:', { fullName: formData.fullName, email: formData.email });
            const response = await authAPI.signup(formData.fullName, formData.email, formData.password);
            console.log('Signup response:', response.data);

            if (response.data.success) {
                console.log('Signup successful, navigating to OTP page');
                toast.success('Account created! Check your email for OTP.');
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                console.log('Signup failed:', response.data);
                const errorMsg = response.data.message || 'Signup failed. Please try again.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error('Signup error:', err);
            console.error('Error response:', err.response);
            const errorMsg = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
            {/* Floating background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-fast"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl shadow-2xl p-8 relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-4 left-4 text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Back</span>
                    </button>

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="mx-auto mb-6"
                        >
                            <img src={logo} alt="ArriBot Logo" className="w-48 h-48 mx-auto object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Join ArriBot
                        </h1>
                        <p className="text-gray-600 mt-2">Create your account to get started</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="input-field"
                                placeholder="Krish Sharma"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="krish@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="Enter your password"
                            />
                            <PasswordAnalyzer password={formData.password} />
                        </div>

                        <div className="flex items-start space-x-3 bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <input
                                type="checkbox"
                                id="disclaimer"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="disclaimer" className="text-sm text-gray-700">
                                <span className="font-medium">Development Disclaimer:</span> This is a development project.
                                We're not responsible for any data loss or issues. By continuing, you acknowledge this is
                                for educational purposes only and there is no fault of ArriBot.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !agreed}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Next Step</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/signin')}
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
