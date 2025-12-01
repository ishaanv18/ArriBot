import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.contact(formData.name, formData.email, formData.message);
            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen animated-bg py-12 px-4">
            {/* Floating background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-medium"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-fast"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        Get In Touch
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Have questions? We'd love to hear from you!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-2xl shadow-2xl p-8 relative z-10"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6"
                            >
                                ✓ Message sent successfully! We'll get back to you soon.
                            </motion.div>
                        )}

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
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="John Doe"
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
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="input-field resize-none"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <span>📤</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="glass rounded-2xl shadow-xl p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                    📧
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                    <p className="text-gray-600">vit1122334@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-2xl shadow-xl p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                    🤖
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">AI Support</h3>
                                    <p className="text-gray-600">Get instant help from our AI ChatBot</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-2xl shadow-xl p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                    ⏰
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Response Time</h3>
                                    <p className="text-gray-600">We typically respond within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
