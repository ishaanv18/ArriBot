import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import logo from '../assets/arribot-logo-new.png';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP(email, otpCode);
            if (response.data.success) {
                navigate('/signin', { state: { verified: true } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '']);
            document.getElementById('otp-0')?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            await authAPI.resendOTP(email);
            setOtp(['', '', '', '']);
            document.getElementById('otp-0')?.focus();
            toast.success('New OTP sent! Check your email.', {
                duration: 4000,
                icon: '📧',
            });
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
            {/* Floating background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-2xl shadow-2xl p-8 relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/signup')}
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
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="mx-auto mb-6"
                        >
                            <img src={logo} alt="ArriBot Logo" className="w-48 h-48 mx-auto object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Verify Your Email
                        </h1>
                        <p className="text-gray-600 mt-2">
                            We've sent a 4-digit code to<br />
                            <span className="font-semibold text-purple-600">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-4">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none bg-white"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Verify & Continue</span>
                            )}
                        </button>
                    </form>

                    {/* Email Warnings */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4"
                    >
                        <div className="flex items-start space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-purple-900 mb-2">Can't find the email?</p>
                                <ul className="text-sm text-purple-700 space-y-1">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Check your <strong>spam/junk folder</strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Email may take <strong>1-2 minutes</strong> to arrive</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Make sure you entered the correct email</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors disabled:opacity-50"
                        >
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
